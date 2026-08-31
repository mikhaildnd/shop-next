'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
    addCartItemAction,
    clearCartAction,
    decrementCartItemAction,
    incrementCartItemAction,
    mergeCartAction,
    removeCartItemAction,
} from '@/app/(shop)/cart/actions';
import type { CartEntry } from '@/lib/cart/cart.types';
import {
    getCartEntries,
    removeMergedCartEntries,
} from '@/lib/cart/cart-storage';
import type { CartDto, CartItemDto } from '@/services/cart/cart.types';

interface UseServerCartOptions {
    initialCartState: CartDto;
}

type MergeStatus = 'idle' | 'merging' | 'error';

export interface UseServerCartResult {
    cartEntries: CartEntry[];
    addCartEntry: (productId: string) => Promise<void>;
    incrementCartEntry: (productId: string) => Promise<void>;
    decrementCartEntry: (productId: string) => Promise<void>;
    removeCartEntry: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartCount: number;
    getCartEntryQuantity: (productId: string) => number | undefined;
    mutationError: boolean;
    mergeStatus: MergeStatus;
    retryMerge: () => void;
    initialCartItems: CartItemDto[];
}

type CartMutation = {
    id: number;
    apply: (entries: CartEntry[]) => CartEntry[];
};

export function useServerCart({
    initialCartState,
}: UseServerCartOptions): UseServerCartResult {
    const [initialCartItems, setInitialCartItems] = useState(
        initialCartState.items,
    );

    const initialCartEntries = initialCartState.items.map(
        ({ product, quantity }) => ({
            productId: product.id,
            quantity,
        }),
    );

    const [cartEntries, setCartEntries] = useState(initialCartEntries);
    const [mutationError, setMutationError] = useState(false);

    const [mergeStatus, setMergeStatus] = useState<MergeStatus>('idle');
    const [mergeAttempt, setMergeAttempt] = useState(0);
    const isMergingRef = useRef(false);

    const cartEntriesRef = useRef(initialCartEntries);
    const confirmedCartEntriesRef = useRef(initialCartEntries);
    const pendingMutationsRef = useRef<CartMutation[]>([]);
    const mutationQueueRef = useRef(Promise.resolve());
    const nextMutationIdRef = useRef(0);

    const updateVisibleCartEntries = useCallback(() => {
        const nextCartEntries = pendingMutationsRef.current.reduce(
            (entries, mutation) => mutation.apply(entries),
            confirmedCartEntriesRef.current,
        );

        cartEntriesRef.current = nextCartEntries;
        setCartEntries(nextCartEntries);
    }, []);

    const retryMerge = useCallback(() => {
        if (isMergingRef.current) {
            return;
        }

        setMergeStatus('idle');
        setMergeAttempt((attempt) => attempt + 1);
    }, []);

    useEffect(() => {
        if (isMergingRef.current) {
            return;
        }

        const localCartEntries = getCartEntries();

        if (localCartEntries.length === 0) {
            return;
        }

        const entriesToMerge = localCartEntries.map((entry) => ({ ...entry }));

        isMergingRef.current = true;

        async function mergeCart() {
            setMergeStatus('merging');

            try {
                const cart = await mergeCartAction(entriesToMerge);

                setInitialCartItems(cart.items);

                confirmedCartEntriesRef.current = cart.items.map(
                    ({ product, quantity }) => ({
                        productId: product.id,
                        quantity,
                    }),
                );
                updateVisibleCartEntries();

                removeMergedCartEntries(entriesToMerge);
                setMergeStatus('idle');
                setMergeAttempt((attempt) => attempt + 1);
            } catch {
                setMergeStatus('error');
            } finally {
                isMergingRef.current = false;
            }
        }

        async function startMerge() {
            await Promise.resolve();
            await mergeCart();
        }

        void startMerge();
    }, [setInitialCartItems, mergeAttempt, updateVisibleCartEntries]);

    const enqueueMutation = useCallback(
        (mutation: CartMutation, action: () => Promise<void>) => {
            setMutationError(false);

            pendingMutationsRef.current.push(mutation);
            updateVisibleCartEntries();

            const execute = async () => {
                try {
                    await action();

                    confirmedCartEntriesRef.current = mutation.apply(
                        confirmedCartEntriesRef.current,
                    );
                } catch {
                    setMutationError(true);
                } finally {
                    pendingMutationsRef.current =
                        pendingMutationsRef.current.filter(
                            (pendingMutation) =>
                                pendingMutation.id !== mutation.id,
                        );

                    updateVisibleCartEntries();
                }
            };

            const queuedMutation = mutationQueueRef.current.then(
                execute,
                execute,
            );

            mutationQueueRef.current = queuedMutation.catch(() => undefined);

            return queuedMutation;
        },
        [updateVisibleCartEntries],
    );

    const createMutation = useCallback(
        (apply: CartMutation['apply']): CartMutation => ({
            id: nextMutationIdRef.current++,
            apply,
        }),
        [],
    );

    const getCartEntryQuantity = useCallback(
        (productId: string) => {
            const entry = cartEntries.find(
                (entry) => entry.productId === productId,
            );

            return entry?.quantity;
        },
        [cartEntries],
    );

    const addCartEntry = useCallback(
        (productId: string) => {
            if (
                cartEntriesRef.current.some(
                    (entry) => entry.productId === productId,
                )
            ) {
                return Promise.resolve();
            }

            return enqueueMutation(
                createMutation((entries) => [
                    { productId, quantity: 1 },
                    ...entries,
                ]),
                () => addCartItemAction(productId),
            );
        },
        [createMutation, enqueueMutation],
    );

    const incrementCartEntry = useCallback(
        (productId: string) => {
            if (
                !cartEntriesRef.current.some(
                    (entry) => entry.productId === productId,
                )
            ) {
                return Promise.resolve();
            }

            return enqueueMutation(
                createMutation((entries) =>
                    entries.map((entry) =>
                        entry.productId === productId
                            ? { ...entry, quantity: entry.quantity + 1 }
                            : entry,
                    ),
                ),
                () => incrementCartItemAction(productId),
            );
        },
        [createMutation, enqueueMutation],
    );

    const decrementCartEntry = useCallback(
        (productId: string) => {
            if (
                !cartEntriesRef.current.some(
                    (entry) => entry.productId === productId,
                )
            ) {
                return Promise.resolve();
            }

            return enqueueMutation(
                createMutation((entries) =>
                    entries
                        .map((entry) =>
                            entry.productId === productId
                                ? { ...entry, quantity: entry.quantity - 1 }
                                : entry,
                        )
                        .filter((item) => item.quantity > 0),
                ),
                () => decrementCartItemAction(productId),
            );
        },
        [createMutation, enqueueMutation],
    );

    const removeCartEntry = useCallback(
        (productId: string) => {
            if (
                !cartEntriesRef.current.some(
                    (entry) => entry.productId === productId,
                )
            ) {
                return Promise.resolve();
            }

            return enqueueMutation(
                createMutation((entries) =>
                    entries.filter((entry) => entry.productId !== productId),
                ),
                () => removeCartItemAction(productId),
            );
        },
        [createMutation, enqueueMutation],
    );

    const clearCart = useCallback(() => {
        if (cartEntriesRef.current.length === 0) {
            return Promise.resolve();
        }

        return enqueueMutation(
            createMutation(() => []),
            clearCartAction,
        );
    }, [createMutation, enqueueMutation]);

    const cartCount = cartEntries.reduce(
        (total, entry) => total + entry.quantity,
        0,
    );

    return {
        cartEntries,
        addCartEntry,
        incrementCartEntry,
        decrementCartEntry,
        removeCartEntry,
        clearCart,
        cartCount,
        getCartEntryQuantity,
        mutationError,
        mergeStatus,
        retryMerge,
        initialCartItems,
    };
}

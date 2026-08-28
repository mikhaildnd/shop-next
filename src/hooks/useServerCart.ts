'use client';

import { useCallback, useRef, useState } from 'react';

import {
    addCartItemAction,
    clearCartAction,
    decrementCartItemAction,
    incrementCartItemAction,
    removeCartItemAction,
} from '@/app/(shop)/cart/actions';
import type { CartEntry } from '@/lib/cart/cart.types';

interface UseServerCartOptions {
    initialCartEntries: CartEntry[];
}

interface UseServerCartResult {
    cartEntries: CartEntry[];
    addCartEntry: (productId: string) => Promise<void>;
    incrementCartEntry: (productId: string) => Promise<void>;
    decrementCartEntry: (productId: string) => Promise<void>;
    removeCartEntry: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartCount: number;
    getCartEntryQuantity: (productId: string) => number | undefined;
    syncCartEntries: (entries: CartEntry[]) => void;
}

type CartMutation = {
    id: number;
    apply: (entries: CartEntry[]) => CartEntry[];
};

export function useServerCart({
    initialCartEntries,
}: UseServerCartOptions): UseServerCartResult {
    const [cartEntries, setCartEntries] = useState(initialCartEntries);

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

    const enqueueMutation = useCallback(
        (mutation: CartMutation, action: () => Promise<void>) => {
            pendingMutationsRef.current.push(mutation);
            updateVisibleCartEntries();

            const execute = async () => {
                try {
                    await action();

                    confirmedCartEntriesRef.current = mutation.apply(
                        confirmedCartEntriesRef.current,
                    );
                } catch {
                    // The visible cart is recalculated below without this mutation.
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

    const syncCartEntries = useCallback(
        (entries: CartEntry[]) => {
            confirmedCartEntriesRef.current = entries;
            updateVisibleCartEntries();
        },
        [updateVisibleCartEntries],
    );

    return {
        cartEntries,
        addCartEntry: addCartEntry,
        incrementCartEntry,
        decrementCartEntry,
        removeCartEntry,
        clearCart,
        cartCount,
        getCartEntryQuantity,
        syncCartEntries,
    };
}

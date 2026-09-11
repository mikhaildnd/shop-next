'use client';

import { useCallback, useRef, useState } from 'react';

import {
    addCartItemAction,
    clearCartAction,
    decrementCartItemAction,
    incrementCartItemAction,
    removeCartItemAction,
} from '@/app/(shop)/cart/actions';
import type { CartEntry, CartProductSnapshot } from '@/lib/cart/cart.types';
import type { CartDto, CartItemDto } from '@/services/cart/cart.types';

interface UseServerCartOptions {
    initialCartState: CartDto;
}

export interface UseServerCartResult {
    cartEntries: CartEntry[];
    addCartEntry: (
        productId: string,
        snapshot: CartProductSnapshot,
    ) => Promise<void>;
    incrementCartEntry: (productId: string) => Promise<void>;
    decrementCartEntry: (productId: string) => Promise<void>;
    removeCartEntry: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartCount: number;
    getCartEntryQuantity: (productId: string) => number | undefined;
    initialCartItems: CartItemDto[];
    replaceCart: (cart: CartDto) => void;
}

type CartMutation = {
    id: number;
    apply: (entries: CartEntry[]) => CartEntry[];
};

type CartAction = () => Promise<void>;

export function useServerCart({
    initialCartState,
}: UseServerCartOptions): UseServerCartResult {
    const [initialCartItems, setInitialCartItems] = useState(
        initialCartState.items,
    );

    const initialCartEntries = initialCartState.items.map(
        ({ product, quantity, snapshot }) => ({
            productId: product.id,
            quantity,
            snapshot,
        }),
    );

    const [cartEntries, setCartEntries] = useState(initialCartEntries);

    const cartEntriesRef = useRef(initialCartEntries);
    const confirmedCartEntriesRef = useRef(initialCartEntries);
    const pendingMutationsRef = useRef<CartMutation[]>([]);
    const mutationQueueRef = useRef<Promise<void>>(Promise.resolve());
    const nextMutationIdRef = useRef(0);

    const updateVisibleCartEntries = useCallback(() => {
        const nextCartEntries = pendingMutationsRef.current.reduce(
            (entries, mutation) => mutation.apply(entries),
            confirmedCartEntriesRef.current,
        );

        cartEntriesRef.current = nextCartEntries;
        setCartEntries(nextCartEntries);
    }, []);

    const replaceCart = useCallback(
        (cart: CartDto) => {
            setInitialCartItems(cart.items);

            confirmedCartEntriesRef.current = cart.items.map(
                ({ product, quantity, snapshot }) => ({
                    productId: product.id,
                    quantity,
                    snapshot,
                }),
            );
            updateVisibleCartEntries();
        },
        [updateVisibleCartEntries],
    );

    const enqueueMutation = useCallback(
        (mutation: CartMutation, action: CartAction): Promise<void> => {
            pendingMutationsRef.current.push(mutation);
            updateVisibleCartEntries();

            const execute = async () => {
                try {
                    await action();

                    confirmedCartEntriesRef.current = mutation.apply(
                        confirmedCartEntriesRef.current,
                    );
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
        (productId: string, snapshot: CartProductSnapshot): Promise<void> =>
            enqueueMutation(
                createMutation((entries) => [
                    {
                        productId,
                        quantity: 1,
                        snapshot,
                    },
                    ...entries,
                ]),
                () => addCartItemAction(productId, snapshot),
            ),
        [createMutation, enqueueMutation],
    );

    const incrementCartEntry = useCallback(
        (productId: string): Promise<void> =>
            enqueueMutation(
                createMutation((entries) =>
                    entries.map((entry) =>
                        entry.productId === productId
                            ? { ...entry, quantity: entry.quantity + 1 }
                            : entry,
                    ),
                ),
                () => incrementCartItemAction(productId),
            ),
        [createMutation, enqueueMutation],
    );

    const decrementCartEntry = useCallback(
        (productId: string): Promise<void> =>
            enqueueMutation(
                createMutation((entries) =>
                    entries
                        .map((entry) =>
                            entry.productId === productId
                                ? { ...entry, quantity: entry.quantity - 1 }
                                : entry,
                        )
                        .filter((entry) => entry.quantity > 0),
                ),
                () => decrementCartItemAction(productId),
            ),
        [createMutation, enqueueMutation],
    );

    const removeCartEntry = useCallback(
        (productId: string): Promise<void> =>
            enqueueMutation(
                createMutation((entries) =>
                    entries.filter((entry) => entry.productId !== productId),
                ),
                () => removeCartItemAction(productId),
            ),
        [createMutation, enqueueMutation],
    );

    const clearCart = useCallback(
        (): Promise<void> =>
            enqueueMutation(
                createMutation(() => []),
                clearCartAction,
            ),
        [createMutation, enqueueMutation],
    );

    const cartCount = cartEntries.reduce(
        (total, entry) => total + entry.quantity,
        0,
    );

    return {
        initialCartItems,
        cartEntries,
        addCartEntry,
        incrementCartEntry,
        decrementCartEntry,
        removeCartEntry,
        clearCart,
        cartCount,
        getCartEntryQuantity,
        replaceCart,
    };
}

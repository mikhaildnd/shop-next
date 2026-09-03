'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';

import type { CartEntry, CartProductSnapshot } from '@/lib/cart/cart.types';
import {
    addCartEntry as addCartEntryToStorage,
    clearCart as clearCartStorage,
    decrementCartEntry as decrementCartEntryFromStorage,
    getCartEntries,
    getServerCartEntries,
    incrementCartEntry as incrementCartEntryInStorage,
    removeCartEntry as removeCartEntryFromStorage,
    removeMergedCartEntries as removeMergedCartEntriesFromStorage,
    subscribeToCart,
} from '@/lib/cart/cart-storage';

export interface UseLocalCartResult {
    cartEntries: CartEntry[];
    addCartEntry: (productId: string, snapshot: CartProductSnapshot) => void;
    incrementCartEntry: (productId: string) => void;
    decrementCartEntry: (productId: string) => void;
    removeCartEntry: (productId: string) => void;
    clearCart: () => void;
    removeMergedCartEntries: (items: CartEntry[]) => void;
    cartCount: number;
    getCartEntryQuantity: (productId: string) => number | undefined;
    mutationError: Error | null;
}

export function useLocalCart(): UseLocalCartResult {
    const cartEntries = useSyncExternalStore(
        subscribeToCart,
        getCartEntries,
        getServerCartEntries,
    );

    const [mutationError, setMutationError] = useState<Error | null>(null);

    const addCartEntry = useCallback(
        (productId: string, snapshot: CartProductSnapshot) => {
            setMutationError(null);

            try {
                addCartEntryToStorage(productId, snapshot);
            } catch (error) {
                setMutationError(
                    error instanceof Error ? error : new Error('Unknown error'),
                );
            }
        },
        [],
    );

    const removeCartEntry = useCallback((productId: string) => {
        setMutationError(null);

        try {
            removeCartEntryFromStorage(productId);
        } catch (error) {
            setMutationError(
                error instanceof Error ? error : new Error('Unknown error'),
            );
        }
    }, []);

    const incrementCartEntry = useCallback((productId: string) => {
        setMutationError(null);

        try {
            incrementCartEntryInStorage(productId);
        } catch (error) {
            setMutationError(
                error instanceof Error ? error : new Error('Unknown error'),
            );
        }
    }, []);

    const decrementCartEntry = useCallback((productId: string) => {
        setMutationError(null);

        try {
            decrementCartEntryFromStorage(productId);
        } catch (error) {
            setMutationError(
                error instanceof Error ? error : new Error('Unknown error'),
            );
        }
    }, []);

    const clearCart = useCallback(() => {
        setMutationError(null);

        try {
            clearCartStorage();
        } catch (error) {
            setMutationError(
                error instanceof Error ? error : new Error('Unknown error'),
            );
        }
    }, []);

    const removeMergedCartEntries = useCallback((items: CartEntry[]) => {
        setMutationError(null);

        try {
            removeMergedCartEntriesFromStorage(items);
        } catch (error) {
            setMutationError(
                error instanceof Error ? error : new Error('Unknown error'),
            );
        }
    }, []);

    const getCartEntryQuantity = useCallback(
        (productId: string) => {
            const entry = cartEntries.find(
                (item) => item.productId === productId,
            );

            return entry?.quantity;
        },
        [cartEntries],
    );

    const cartCount = cartEntries.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    return {
        cartEntries,
        addCartEntry,
        removeCartEntry,
        incrementCartEntry,
        decrementCartEntry,
        clearCart,
        removeMergedCartEntries,
        cartCount,
        getCartEntryQuantity,
        mutationError,
    };
}

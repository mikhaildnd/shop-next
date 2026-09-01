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
    mutationError: boolean;
}

export function useLocalCart(): UseLocalCartResult {
    const cartEntries = useSyncExternalStore(
        subscribeToCart,
        getCartEntries,
        getServerCartEntries,
    );

    const [mutationError, setMutationError] = useState(false);

    const addCartEntry = useCallback(
        (productId: string, snapshot: CartProductSnapshot) => {
            setMutationError(false);

            try {
                addCartEntryToStorage(productId, snapshot);
            } catch {
                setMutationError(true);
            }
        },
        [],
    );

    const removeCartEntry = useCallback((productId: string) => {
        setMutationError(false);

        try {
            removeCartEntryFromStorage(productId);
        } catch {
            setMutationError(true);
        }
    }, []);

    const incrementCartEntry = useCallback((productId: string) => {
        setMutationError(false);

        try {
            incrementCartEntryInStorage(productId);
        } catch {
            setMutationError(true);
        }
    }, []);

    const decrementCartEntry = useCallback((productId: string) => {
        setMutationError(false);

        try {
            decrementCartEntryFromStorage(productId);
        } catch {
            setMutationError(true);
        }
    }, []);

    const clearCart = useCallback(() => {
        setMutationError(false);

        try {
            clearCartStorage();
        } catch {
            setMutationError(true);
        }
    }, []);

    const removeMergedCartEntries = useCallback((items: CartEntry[]) => {
        setMutationError(false);

        try {
            removeMergedCartEntriesFromStorage(items);
        } catch {
            setMutationError(true);
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

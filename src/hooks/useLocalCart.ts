'use client';

import { useCallback, useSyncExternalStore } from 'react';

import type { CartEntry, CartProductSnapshot } from '@/lib/cart/cart.types';
import {
    addCartEntry as addCartEntryToStorage,
    clearCart as clearCartStorage,
    decrementCartEntry as decrementCartEntryFromStorage,
    getCartEntries,
    getServerCartEntries,
    incrementCartEntry as incrementCartEntryInStorage,
    removeCartEntry as removeCartEntryFromStorage,
    subscribeToCart,
} from '@/lib/cart/cart-storage';

export interface UseLocalCartResult {
    cartEntries: CartEntry[];
    addCartEntry: (productId: string, snapshot: CartProductSnapshot) => void;
    incrementCartEntry: (productId: string) => void;
    decrementCartEntry: (productId: string) => void;
    removeCartEntry: (productId: string) => void;
    clearCart: () => void;
    cartCount: number;
    getCartEntryQuantity: (productId: string) => number | undefined;
    isHydrated: boolean;
}

export function useLocalCart(): UseLocalCartResult {
    const cartEntries = useSyncExternalStore(
        subscribeToCart,
        getCartEntries,
        getServerCartEntries,
    );

    const isHydrated = useSyncExternalStore(
        subscribeToCart,
        () => true,
        () => false,
    );

    const addCartEntry = useCallback(
        (productId: string, snapshot: CartProductSnapshot) => {
            addCartEntryToStorage(productId, snapshot);
        },
        [],
    );

    const removeCartEntry = useCallback((productId: string) => {
        removeCartEntryFromStorage(productId);
    }, []);

    const incrementCartEntry = useCallback((productId: string) => {
        incrementCartEntryInStorage(productId);
    }, []);

    const decrementCartEntry = useCallback((productId: string) => {
        decrementCartEntryFromStorage(productId);
    }, []);

    const clearCart = useCallback(() => {
        clearCartStorage();
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
        cartCount,
        getCartEntryQuantity,
        isHydrated,
    };
}

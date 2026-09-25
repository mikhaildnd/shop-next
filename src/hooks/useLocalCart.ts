'use client';

import { useCallback, useSyncExternalStore } from 'react';

import type { CartEntry, CartItemSnapshot } from '@/lib/cart/cart.types';
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
    entries: CartEntry[];
    addCartItem: (productId: string, snapshot: CartItemSnapshot) => void;
    incrementCartItem: (productId: string) => void;
    decrementCartItem: (productId: string) => void;
    removeCartItem: (productId: string) => void;
    clearCart: () => void;
    cartCount: number;
    getCartItemQuantity: (productId: string) => number | undefined;
    isHydrated: boolean;
}

export function useLocalCart(): UseLocalCartResult {
    const entries = useSyncExternalStore(
        subscribeToCart,
        getCartEntries,
        getServerCartEntries,
    );

    const isHydrated = useSyncExternalStore(
        subscribeToCart,
        () => true,
        () => false,
    );

    const addCartItem = useCallback(
        (productId: string, snapshot: CartItemSnapshot) => {
            addCartEntryToStorage(productId, snapshot);
        },
        [],
    );

    const removeCartItem = useCallback((productId: string) => {
        removeCartEntryFromStorage(productId);
    }, []);

    const incrementCartItem = useCallback((productId: string) => {
        incrementCartEntryInStorage(productId);
    }, []);

    const decrementCartItem = useCallback((productId: string) => {
        decrementCartEntryFromStorage(productId);
    }, []);

    const clearCart = useCallback(() => {
        clearCartStorage();
    }, []);

    const getCartItemQuantity = useCallback(
        (productId: string) => {
            const entry = entries.find(
                (entry) => entry.productId === productId,
            );

            return entry?.quantity;
        },
        [entries],
    );

    const cartCount = entries.reduce(
        (total, entry) => total + entry.quantity,
        0,
    );

    return {
        entries,
        addCartItem,
        removeCartItem,
        incrementCartItem,
        decrementCartItem,
        clearCart,
        cartCount,
        getCartItemQuantity,
        isHydrated,
    };
}

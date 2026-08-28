'use client';

import { useCallback, useSyncExternalStore } from 'react';

import type { CartEntry } from '@/lib/cart/cart.types';
import {
    addCartEntry,
    clearCart,
    decrementCartEntry,
    getCartEntries,
    getServerCartEntries,
    incrementCartEntry,
    removeCartEntry,
    removeMergedCartEntries,
    subscribeToCart,
} from '@/lib/cart/cart-storage';

interface UseLocalCartResult {
    cartEntries: CartEntry[];
    isHydrated: boolean;
    addCartEntry: (productId: string) => void;
    incrementCartEntry: (productId: string) => void;
    decrementCartEntry: (productId: string) => void;
    removeCartEntry: (productId: string) => void;
    clearCart: () => void;
    removeMergedCartEntries: (items: CartEntry[]) => void;
    cartCount: number;
    getCartEntryQuantity: (productId: string) => number | undefined;
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
        isHydrated,
        addCartEntry,
        removeCartEntry,
        incrementCartEntry,
        decrementCartEntry,
        clearCart,
        removeMergedCartEntries,
        cartCount,
        getCartEntryQuantity,
    };
}

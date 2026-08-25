'use client';

import { useCallback, useSyncExternalStore } from 'react';

import type { CartItem } from '@/lib/cart/cart.types';
import {
    addCartItem,
    clearCart,
    decrementCartItem,
    getCartItems,
    getServerCartItems,
    incrementCartItem,
    removeCartItem,
    subscribeToCart,
} from '@/lib/cart/cart-storage';

interface UseLocalCartResult {
    cartItems: CartItem[];
    isHydrated: boolean;
    addCartItem: (productId: string) => void;
    incrementCartItem: (productId: string) => void;
    decrementCartItem: (productId: string) => void;
    removeCartItem: (productId: string) => void;
    clearCart: () => void;
    cartCount: number;
    getCartItemQuantity: (productId: string) => number;
}

export function useLocalCart(): UseLocalCartResult {
    const cartItems = useSyncExternalStore(
        subscribeToCart,
        getCartItems,
        getServerCartItems,
    );

    const isHydrated = useSyncExternalStore(
        subscribeToCart,
        () => true,
        () => false,
    );

    const getCartItemQuantity = useCallback(
        (productId: string) => {
            const item = cartItems.find((item) => item.productId === productId);

            return item?.quantity ?? 0;
        },
        [cartItems],
    );

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    return {
        cartItems,
        isHydrated,
        addCartItem,
        removeCartItem,
        incrementCartItem,
        decrementCartItem,
        clearCart,
        cartCount,
        getCartItemQuantity,
    };
}

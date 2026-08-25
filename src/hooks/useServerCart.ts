'use client';

import { useCallback, useState } from 'react';

import {
    addCartItemAction,
    clearCartAction,
    decrementCartItemAction,
    incrementCartItemAction,
    removeCartItemAction,
} from '@/app/(shop)/(catalog)/cart/actions';
import type { CartItem } from '@/lib/cart/cart.types';

interface UseServerCartOptions {
    initialCartItems: CartItem[];
}

interface UseServerCartResult {
    cartItems: CartItem[];
    addCartItem: (productId: string) => void;
    incrementCartItem: (productId: string) => void;
    decrementCartItem: (productId: string) => void;
    removeCartItem: (productId: string) => void;
    clearCart: () => void;
    cartCount: number;
    getCartItemQuantity: (productId: string) => number;
    syncCartItems: (items: CartItem[]) => void;
}

export function useServerCart({
    initialCartItems,
}: UseServerCartOptions): UseServerCartResult {
    const [cartItems, setCartItems] = useState(initialCartItems);

    const getCartItemQuantity = useCallback(
        (productId: string) => {
            const item = cartItems.find((item) => item.productId === productId);

            return item?.quantity ?? 0;
        },
        [cartItems],
    );

    const addCartItem = useCallback(
        async (productId: string) => {
            const existingItem = cartItems.find(
                (item) => item.productId === productId,
            );

            if (existingItem) {
                return;
            }

            setCartItems((current) => [
                ...current,
                {
                    productId,
                    quantity: 1,
                },
            ]);

            try {
                await addCartItemAction(productId);
            } catch {
                setCartItems((current) =>
                    current.filter((item) => item.productId !== productId),
                );
            }
        },
        [cartItems],
    );

    const incrementCartItem = useCallback(
        async (productId: string) => {
            const previousCartItems = cartItems;

            setCartItems((current) =>
                current.map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                ),
            );

            try {
                await incrementCartItemAction(productId);
            } catch {
                setCartItems(previousCartItems);
            }
        },
        [cartItems],
    );

    const decrementCartItem = useCallback(
        async (productId: string) => {
            const previousCartItems = cartItems;

            setCartItems((current) =>
                current
                    .map((item) =>
                        item.productId === productId
                            ? { ...item, quantity: item.quantity - 1 }
                            : item,
                    )
                    .filter((item) => item.quantity > 0),
            );

            try {
                await decrementCartItemAction(productId);
            } catch {
                setCartItems(previousCartItems);
            }
        },
        [cartItems],
    );

    const removeCartItem = useCallback(
        async (productId: string) => {
            const previousCartItems = cartItems;

            setCartItems((current) =>
                current.filter((item) => item.productId !== productId),
            );

            try {
                await removeCartItemAction(productId);
            } catch {
                setCartItems(previousCartItems);
            }
        },
        [cartItems],
    );

    const clearCart = useCallback(async () => {
        const previousCartItems = cartItems;

        setCartItems([]);

        try {
            await clearCartAction();
        } catch {
            setCartItems(previousCartItems);
        }
    }, [cartItems]);

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const syncCartItems = useCallback((items: CartItem[]) => {
        setCartItems(items);
    }, []);

    return {
        cartItems,
        addCartItem,
        incrementCartItem,
        decrementCartItem,
        removeCartItem,
        clearCart,
        cartCount,
        getCartItemQuantity,
        syncCartItems,
    };
}

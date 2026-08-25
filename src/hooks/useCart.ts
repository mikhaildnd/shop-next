'use client';

import { useEffect } from 'react';

import { mergeCartAction } from '@/app/(shop)/(catalog)/cart/actions';
import { useLocalCart } from '@/hooks/useLocalCart';
import { useServerCart } from '@/hooks/useServerCart';
import type { CartDto } from '@/services/cart/cart.types';

interface UseCartOptions {
    isAuthenticated: boolean;
    initialCartState: CartDto;
}

export function useCart({ isAuthenticated, initialCartState }: UseCartOptions) {
    const initialCartItems = initialCartState.items.map(
        ({ product, quantity }) => ({
            productId: product.id,
            quantity,
        }),
    );

    const localCart = useLocalCart();

    const serverCart = useServerCart({
        initialCartItems,
    });

    const {
        cartItems: localCartItems,
        isHydrated: isLocalHydrated,
        clearCart: clearLocalCart,
    } = localCart;

    const { syncCartItems } = serverCart;

    useEffect(() => {
        if (!isAuthenticated || !isLocalHydrated) {
            return;
        }

        if (localCartItems.length === 0) {
            return;
        }

        async function mergeCart() {
            try {
                const cart = await mergeCartAction(localCartItems);

                const cartItems = cart.items.map(({ product, quantity }) => ({
                    productId: product.id,
                    quantity,
                }));

                syncCartItems(cartItems);
                clearLocalCart();
            } catch {
                // Keep local cart when the merge fails.
            }
        }

        void mergeCart();
    }, [
        isAuthenticated,
        isLocalHydrated,
        localCartItems,
        syncCartItems,
        clearLocalCart,
    ]);

    return isAuthenticated ? serverCart : localCart;
}

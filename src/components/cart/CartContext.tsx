'use client';

import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import { useCart } from '@/hooks/useCart';
import { createActionQueue } from '@/lib/async/action-queue';
import type { CartItemData, CartItemSnapshot } from '@/lib/cart/cart.types';
import type { CartSummaryData } from '@/lib/cart/get-cart-summary';
import { getCartSummary } from '@/lib/cart/get-cart-summary';
import type { CartData } from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

interface CartContextValue {
    cartItems: CartItemData[];
    cartSummary: CartSummaryData;
    cartCount: number;
    addCartItem: (
        product: ProductDto,
        snapshot: CartItemSnapshot,
    ) => Promise<void>;
    getCartItem: (productId: string) => CartItemData | undefined;
    incrementCartItem: (productId: string) => void;
    decrementCartItem: (productId: string) => void;
    removeCartItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    isQuantityUpdating: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
    initialCartState: CartData;
    children: ReactNode;
}

export function CartProvider({
    initialCartState,
    children,
}: CartProviderProps) {
    const [actionQueue] = useState(createActionQueue);

    const cart = useCart({
        initialCartState,
        actionQueue,
    });

    const cartItems = useMemo(() => {
        const productsById = new Map(
            cart.products.map((product) => [product.productId, product]),
        );

        const pendingQuantity = cart.pendingQuantity;

        return cart.items.map((item) => {
            const product = productsById.get(item.productId);

            if (!product) {
                throw new Error(`Cart product not found: ${item.productId}`);
            }

            return {
                ...item,
                displayQuantity:
                    pendingQuantity?.productId === item.productId
                        ? pendingQuantity.quantity
                        : item.quantity,
                product,
            };
        });
    }, [cart.items, cart.products, cart.pendingQuantity]);

    const getCartItem = useCallback(
        (productId: string) =>
            cartItems.find((item) => item.productId === productId),
        [cartItems],
    );

    const cartSummary = useMemo(() => getCartSummary(cartItems), [cartItems]);
    const isQuantityUpdating = cart.pendingQuantity !== null;

    const contextValue: CartContextValue = {
        cartItems,
        cartSummary,
        cartCount: cart.cartCount,
        addCartItem: cart.addCartItem,
        getCartItem,
        incrementCartItem: cart.incrementCartItem,
        decrementCartItem: cart.decrementCartItem,
        removeCartItem: cart.removeCartItem,
        clearCart: cart.clearCart,
        isQuantityUpdating,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCartContext must be used within a cart provider');
    }

    return context;
}

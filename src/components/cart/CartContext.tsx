'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import { useCart } from '@/hooks/useCart';
import { createActionQueue } from '@/lib/async/action-queue';
import type { CartItemData, CartItemSnapshot } from '@/lib/cart/cart.types';
import type { CartSummaryData } from '@/lib/cart/get-cart-summary';
import { getCartSummary } from '@/lib/cart/get-cart-summary';
import type { CartData, CartItemDto } from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

interface CartContextValue {
    cartItems: CartItemData[];
    cartSummary: CartSummaryData;
    cartCount: number;
    addCartItem: (
        product: ProductDto,
        snapshot: CartItemSnapshot,
    ) => Promise<void>;
    getCartItem: (productId: string) => CartItemDto | undefined;
    incrementCartItem: (productId: string) => Promise<void>;
    decrementCartItem: (productId: string) => Promise<void>;
    removeCartItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
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

        return cart.items.map((item) => ({
            ...item,
            product: productsById.get(item.productId) ?? null,
        }));
    }, [cart.items, cart.products]);

    const cartSummary = useMemo(() => getCartSummary(cartItems), [cartItems]);

    const contextValue: CartContextValue = {
        cartItems,
        cartSummary,
        cartCount: cart.cartCount,
        addCartItem: cart.addCartItem,
        getCartItem: cart.getCartItem,
        incrementCartItem: cart.incrementCartItem,
        decrementCartItem: cart.decrementCartItem,
        removeCartItem: cart.removeCartItem,
        clearCart: cart.clearCart,
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

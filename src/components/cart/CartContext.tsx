'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { useCart } from '@/hooks/useCart';
import type { CartDto } from '@/services/cart/cart.types';

type CartContextValue = ReturnType<typeof useCart> & {
    initialCartState: CartDto;
};

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
    isAuthenticated: boolean;
    initialCartState: CartDto;
    children: ReactNode;
}

export function CartProvider({
    isAuthenticated,
    initialCartState,
    children,
}: CartProviderProps) {
    const cart = useCart({
        isAuthenticated,
        initialCartState,
    });

    return (
        <CartContext.Provider
            value={{
                ...cart,
                initialCartState,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCartContext must be used within CartProvider');
    }

    return context;
}

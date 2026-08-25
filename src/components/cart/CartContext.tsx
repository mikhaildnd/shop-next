'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { useCart } from '@/hooks/useCart';
import type { CartDto } from '@/services/cart/cart.types';

const CartContext = createContext<ReturnType<typeof useCart> | null>(null);

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

    return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCartContext must be used within CartProvider');
    }

    return context;
}

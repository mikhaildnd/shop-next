'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { useLocalCart } from '@/hooks/useLocalCart';

const CartContext = createContext<ReturnType<typeof useLocalCart> | null>(null);

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
    const cart = useLocalCart();

    return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCartContext must be used within CartProvider');
    }

    return context;
}

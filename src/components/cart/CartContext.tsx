'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

import { CartMergeStatus } from '@/app/(shop)/cart/_components/CartMergeStatus';
import { useCartMerge } from '@/hooks/useCartMerge';
import { useLocalCart } from '@/hooks/useLocalCart';
import { useServerCart } from '@/hooks/useServerCart';
import { createActionQueue } from '@/lib/async/action-queue';
import type { CartProductSnapshot } from '@/lib/cart/cart.types';
import type { CartDto, CartItemDto } from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

interface CartContextValue {
    items: CartItemDto[];
    cartCount: number;
    getCartItemQuantity: (productId: string) => number | undefined;
    addCartItem: (
        product: ProductDto,
        snapshot: CartProductSnapshot,
    ) => void | Promise<void>;
    incrementCartItem: (productId: string) => void | Promise<void>;
    decrementCartItem: (productId: string) => void | Promise<void>;
    removeCartItem: (productId: string) => void | Promise<void>;
    clearCart: () => void | Promise<void>;
    isHydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
    isAuthenticated: boolean;
    initialCartState: CartDto;
    children: ReactNode;
}

interface LocalCartProviderProps {
    children: ReactNode;
}

interface ServerCartProviderProps {
    initialCartState: CartDto;
    children: ReactNode;
}

export function CartProvider({
    isAuthenticated,
    initialCartState,
    children,
}: CartProviderProps) {
    if (isAuthenticated) {
        return (
            <ServerCartProvider initialCartState={initialCartState}>
                {children}
            </ServerCartProvider>
        );
    }

    return <LocalCartProvider>{children}</LocalCartProvider>;
}

function LocalCartProvider({ children }: LocalCartProviderProps) {
    const cart = useLocalCart();

    const contextValue: CartContextValue = {
        items: cart.items,
        cartCount: cart.cartCount,
        getCartItemQuantity: cart.getCartItemQuantity,
        addCartItem: cart.addCartItem,
        incrementCartItem: cart.incrementCartItem,
        decrementCartItem: cart.decrementCartItem,
        removeCartItem: cart.removeCartItem,
        clearCart: cart.clearCart,
        isHydrated: cart.isHydrated,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

function ServerCartProvider({
    initialCartState,
    children,
}: ServerCartProviderProps) {
    const [actionQueue] = useState(createActionQueue);

    const cart = useServerCart({
        initialCartState,
        actionQueue,
    });

    const merge = useCartMerge({
        actionQueue,
        replaceCart: cart.replaceCart,
    });

    const contextValue: CartContextValue = {
        items: cart.items,
        cartCount: cart.cartCount,
        getCartItemQuantity: cart.getCartItemQuantity,
        addCartItem: cart.addCartItem,
        incrementCartItem: cart.incrementCartItem,
        decrementCartItem: cart.decrementCartItem,
        removeCartItem: cart.removeCartItem,
        clearCart: cart.clearCart,
        isHydrated: true,
    };

    return (
        <>
            <CartContext.Provider value={contextValue}>
                {children}
            </CartContext.Provider>

            <CartMergeStatus
                mergeStatus={merge.mergeStatus}
                mergeAttempt={merge.mergeAttempt}
                retryMerge={merge.retryMerge}
            />
        </>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCartContext must be used within CartProvider');
    }

    return context;
}

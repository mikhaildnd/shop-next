'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

import { CartMergeStatus } from '@/app/(shop)/cart/_components/CartMergeStatus';
import { useCartMerge } from '@/hooks/useCartMerge';
import { useCartProducts } from '@/hooks/useCartProducts';
import { useLocalCart } from '@/hooks/useLocalCart';
import { useServerCart } from '@/hooks/useServerCart';
import { createActionQueue } from '@/lib/async/action-queue';
import type { CartEntry, CartProductSnapshot } from '@/lib/cart/cart.types';
import type { CartDto, CartItemDto } from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

interface CartContextValue {
    cartEntries: CartEntry[];
    items: CartItemDto[];
    products: ProductDto[];
    isLoadingProducts: boolean;
    isRetryingProducts: boolean;
    productsError: Error | null;
    retryProducts: () => void;
    cartCount: number;
    getCartEntryQuantity: (productId: string) => number | undefined;
    addCartEntry: (
        productId: string,
        snapshot: CartProductSnapshot,
    ) => void | Promise<void>;
    incrementCartEntry: (productId: string) => void | Promise<void>;
    decrementCartEntry: (productId: string) => void | Promise<void>;
    removeCartEntry: (productId: string) => void | Promise<void>;
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
        cartEntries: cart.cartEntries,
        items: cart.items,
        products: cart.items.map(({ product }) => product),
        isLoadingProducts: cart.isLoadingItems,
        isRetryingProducts: cart.isRetryingItems,
        productsError: cart.itemsError,
        retryProducts: cart.retryItems,
        cartCount: cart.cartCount,
        getCartEntryQuantity: cart.getCartEntryQuantity,
        addCartEntry: cart.addCartEntry,
        incrementCartEntry: cart.incrementCartEntry,
        decrementCartEntry: cart.decrementCartEntry,
        removeCartEntry: cart.removeCartEntry,
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

    const productsState = useCartProducts({
        cartEntries: cart.cartEntries,
        initialProducts: initialCartState.items.map(({ product }) => product),
    });

    const merge = useCartMerge({
        actionQueue,
        replaceCart: cart.replaceCart,
    });

    const items = cart.cartEntries
        .map((entry) => {
            const product = productsState.products.find(
                (product) => product.id === entry.productId,
            );

            if (!product) {
                return null;
            }

            return {
                product,
                quantity: entry.quantity,
                snapshot: entry.snapshot,
            };
        })
        .filter((item): item is CartItemDto => item !== null);

    const contextValue: CartContextValue = {
        cartEntries: cart.cartEntries,
        items,
        products: productsState.products,
        isLoadingProducts: productsState.isLoadingProducts,
        isRetryingProducts: productsState.isRetryingProducts,
        productsError: productsState.productsError,
        retryProducts: productsState.retryProducts,
        cartCount: cart.cartCount,
        getCartEntryQuantity: cart.getCartEntryQuantity,
        addCartEntry: cart.addCartEntry,
        incrementCartEntry: cart.incrementCartEntry,
        decrementCartEntry: cart.decrementCartEntry,
        removeCartEntry: cart.removeCartEntry,
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

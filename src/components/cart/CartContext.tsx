'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { NotificationToast } from '@/components/NotificationToast';
import { useLocalCart } from '@/hooks/useLocalCart';
import { useServerCart } from '@/hooks/useServerCart';
import type { CartEntry, CartProductSnapshot } from '@/lib/cart/cart.types';
import type { CartDto, CartItemDto } from '@/services/cart/cart.types';

interface CartContextValue {
    cartEntries: CartEntry[];
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
    mutationError: boolean;
    initialCartItems: CartItemDto[];
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
        cartCount: cart.cartCount,
        getCartEntryQuantity: cart.getCartEntryQuantity,
        addCartEntry: cart.addCartEntry,
        incrementCartEntry: cart.incrementCartEntry,
        decrementCartEntry: cart.decrementCartEntry,
        removeCartEntry: cart.removeCartEntry,
        clearCart: cart.clearCart,
        mutationError: cart.mutationError,
        initialCartItems: [],
    };

    return (
        <>
            <CartContext.Provider value={contextValue}>
                {children}
            </CartContext.Provider>

            {cart.mutationError && (
                <NotificationToast message="Произошла ошибка. Попробуйте ещё раз." />
            )}
        </>
    );
}

function ServerCartProvider({
    initialCartState,
    children,
}: ServerCartProviderProps) {
    const cart = useServerCart({
        initialCartState,
    });

    const contextValue: CartContextValue = {
        cartEntries: cart.cartEntries,
        cartCount: cart.cartCount,
        getCartEntryQuantity: cart.getCartEntryQuantity,
        addCartEntry: cart.addCartEntry,
        incrementCartEntry: cart.incrementCartEntry,
        decrementCartEntry: cart.decrementCartEntry,
        removeCartEntry: cart.removeCartEntry,
        clearCart: cart.clearCart,
        mutationError: cart.mutationError,
        initialCartItems: cart.initialCartItems,
    };

    const notification =
        cart.mergeStatus === 'merging'
            ? {
                  message: 'Синхронизация корзины...',
                  loading: true,
              }
            : cart.mergeStatus === 'error'
              ? {
                    message: 'Не удалось синхронизировать корзину.',
                    action: {
                        label: 'Повторить',
                        onClick: cart.retryMerge,
                    },
                }
              : cart.mutationError
                ? {
                      message: 'Произошла ошибка. Попробуйте ещё раз.',
                  }
                : null;

    return (
        <>
            <CartContext.Provider value={contextValue}>
                {children}
            </CartContext.Provider>

            {notification && <NotificationToast {...notification} />}
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

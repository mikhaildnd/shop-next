'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { createContext, useContext } from 'react';

import { toast } from '@/components/ui/toast';
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
    mutationError: Error | null;
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

    useEffect(() => {
        if (cart.mutationError) {
            toast.add({
                id: 'cart-mutation-error',
                description: 'Произошла ошибка. Попробуйте ещё раз',
                type: 'error',
            });
        }
    }, [cart.mutationError]);

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

    const mergeToastId = useRef<string | null>(null);

    useEffect(() => {
        if (cart.mergeStatus === 'merging') {
            if (cart.mergeAttempt === 0) {
                return;
            }
            if (mergeToastId.current) {
                toast.update(mergeToastId.current, {
                    description: 'Синхронизация корзины...',
                    type: 'loading',
                    timeout: 0,
                    actionProps: undefined,
                });
            } else {
                mergeToastId.current = toast.add({
                    description: 'Синхронизация корзины...',
                    type: 'loading',
                    timeout: 0,
                });
            }

            return;
        }

        if (cart.mergeStatus === 'error') {
            if (!mergeToastId.current) {
                mergeToastId.current = toast.add({
                    description: 'Не удалось синхронизировать корзину',
                    type: 'error',
                    timeout: 0,
                    actionProps: {
                        children: 'Повторить',
                        onClick: cart.retryMerge,
                    },
                });

                return;
            }

            toast.update(mergeToastId.current, {
                description: 'Не удалось синхронизировать корзину',
                type: 'error',
                timeout: 0,
                actionProps: {
                    children: 'Повторить',
                    onClick: cart.retryMerge,
                },
            });

            return;
        }

        if (mergeToastId.current) {
            toast.close(mergeToastId.current);
            mergeToastId.current = null;
        }
    }, [cart.mergeAttempt, cart.mergeStatus, cart.retryMerge]);

    useEffect(() => {
        if (cart.mutationError) {
            toast.add({
                id: 'cart-mutation-error',
                description: 'Произошла ошибка. Попробуйте ещё раз',
                type: 'error',
            });
        }
    }, [cart.mutationError]);

    return (
        <CartContext.Provider value={contextValue}>
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

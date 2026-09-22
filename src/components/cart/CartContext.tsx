'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import { CartMergeStatus } from '@/app/(shop)/cart/_components/CartMergeStatus';
import {
    type CartProductsState,
    useCartProducts,
} from '@/hooks/useCartProducts';
import { useCartMerge } from '@/hooks/useCartMerge';
import { useLocalCart } from '@/hooks/useLocalCart';
import { useServerCart } from '@/hooks/useServerCart';
import { createActionQueue } from '@/lib/async/action-queue';
import type {
    CartItemData,
    CartProductSnapshot,
} from '@/lib/cart/cart.types';
import { getCartItemsData } from '@/lib/cart/get-cart-items-data';
import type { CartInitialData } from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

interface CartContextValue {
    items: CartItemData[];
    isHydrated: boolean;
    itemsState: CartProductsState;
    retryItems: () => void;
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
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
    isAuthenticated: boolean;
    initialCartState: CartInitialData;
    children: ReactNode;
}

interface LocalCartProviderProps {
    children: ReactNode;
}

interface ServerCartProviderProps {
    initialCartState: CartInitialData;
    children: ReactNode;
}

function LocalCartProvider({ children }: LocalCartProviderProps) {
    const cart = useLocalCart();

    const productIds = useMemo(
        () => cart.entries.map((entry) => entry.productId),
        [cart.entries],
    );
    const products = useCartProducts({
        productIds,
        enabled: cart.isHydrated,
    });

    const addCartItem = (product: ProductDto, snapshot: CartProductSnapshot) => {
        products.upsertProduct(product);
        cart.addCartItem(product.id, snapshot);
    };

    const items = getCartItemsData(
        cart.entries.map((entry) => ({
            productId: entry.productId,
            quantity: entry.quantity,
            snapshot: entry.snapshot,
        })),
        products.products,
    );

    const contextValue: CartContextValue = {
        items,
        isHydrated: cart.isHydrated,
        itemsState: products.state,
        retryItems: products.retry,
        cartCount: cart.cartCount,
        getCartItemQuantity: cart.getCartItemQuantity,
        addCartItem,
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

function ServerCartProvider({
    initialCartState,
    children,
}: ServerCartProviderProps) {
    const [actionQueue] = useState(createActionQueue);

    const cart = useServerCart({
        initialCartState: initialCartState.cart,
        actionQueue,
    });

    const products = useCartProducts({
        productIds: cart.items.map((item) => item.productId),
        enabled: true,
        initialProducts: initialCartState.products,
    });

    const merge = useCartMerge({
        actionQueue,
        replaceCart: cart.replaceCart,
    });

    const items = getCartItemsData(cart.items, products.products);

    const contextValue: CartContextValue = {
        items,
        isHydrated: true,
        itemsState: products.state,
        retryItems: products.retry,
        cartCount: cart.cartCount,
        getCartItemQuantity: cart.getCartItemQuantity,
        addCartItem: (product, snapshot) => {
            products.upsertProduct(product);
            return cart.addCartItem(product, snapshot);
        },
        incrementCartItem: cart.incrementCartItem,
        decrementCartItem: cart.decrementCartItem,
        removeCartItem: cart.removeCartItem,
        clearCart: cart.clearCart,
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

export function useCartContext() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCartContext must be used within a cart provider');
    }

    return context;
}

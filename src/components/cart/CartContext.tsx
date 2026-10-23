'use client';

import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import { useCart } from '@/hooks/useCart';
import { createActionQueue } from '@/lib/async/action-queue';
import type { CartItemData } from '@/lib/cart/cart.types';
import type { CartSummaryData } from '@/lib/cart/get-cart-summary';
import { getCartSummary } from '@/lib/cart/get-cart-summary';
import type { CartData } from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

interface CartContextValue {
    cartItems: CartItemData[];
    availableCartItems: CartItemData[];
    unavailableCartItems: CartItemData[];
    cartSummary: CartSummaryData;
    cartCount: number;
    hasPriceChanges: boolean;
    addCartItem: (product: ProductDto) => Promise<void>;
    getCartItem: (productId: string) => CartItemData | undefined;
    incrementCartItem: (productId: string) => void;
    decrementCartItem: (productId: string) => void;
    removeCartItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    isQuantityUpdating: boolean;
    replaceCartData: (cartData: CartData) => void;
    updateCartItemPriceSnapshots: (productIds: string[]) => Promise<void>;
    setCartItemSelection: (
        productId: string,
        isSelected: boolean,
    ) => Promise<void>;
    setAllCartItemsSelection: (isSelected: boolean) => Promise<void>;
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

    const availableCartItems = useMemo(
        () => cartItems.filter((item) => item.product.stock > 0),
        [cartItems],
    );

    const unavailableCartItems = useMemo(
        () => cartItems.filter((item) => item.product.stock === 0),
        [cartItems],
    );

    const getCartItem = useCallback(
        (productId: string) =>
            cartItems.find((item) => item.productId === productId),
        [cartItems],
    );

    const selectedCartItems = useMemo(
        () => availableCartItems.filter((item) => item.isSelected),
        [availableCartItems],
    );

    const cartSummary = useMemo(
        () => getCartSummary(selectedCartItems),
        [selectedCartItems],
    );

    const isQuantityUpdating = cart.pendingQuantity !== null;

    const hasPriceChanges = availableCartItems.some(
        (item) => item.snapshot.effectivePrice !== item.product.effectivePrice,
    );

    const contextValue: CartContextValue = {
        cartItems,
        availableCartItems,
        unavailableCartItems,
        cartSummary,
        hasPriceChanges,
        cartCount: cart.cartCount,
        addCartItem: cart.addCartItem,
        getCartItem,
        incrementCartItem: cart.incrementCartItem,
        decrementCartItem: cart.decrementCartItem,
        removeCartItem: cart.removeCartItem,
        clearCart: cart.clearCart,
        isQuantityUpdating,
        replaceCartData: cart.replaceCartData,
        updateCartItemPriceSnapshots: cart.updateCartItemPriceSnapshots,
        setCartItemSelection: cart.setCartItemSelection,
        setAllCartItemsSelection: cart.setAllCartItemsSelection,
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

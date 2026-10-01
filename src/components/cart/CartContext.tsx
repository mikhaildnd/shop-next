'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import { useCart } from '@/hooks/useCart';
import {
    type CartProductsState,
    useCartProducts,
} from '@/hooks/useCartProducts';
import { createActionQueue } from '@/lib/async/action-queue';
import type { CartItemData, CartItemSnapshot } from '@/lib/cart/cart.types';
import { getCartItemsData } from '@/lib/cart/get-cart-items-data';
import { getCartQuantityAdjustments } from '@/lib/cart/get-cart-quantity-adjustments';
import type { CartSummaryData } from '@/lib/cart/get-cart-summary';
import { getCartSummary } from '@/lib/cart/get-cart-summary';
import type { CartInitialData } from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

interface CartContextValue {
    cartItems: CartItemData[];
    cartSummary: CartSummaryData;
    productsState: CartProductsState;
    retryProducts: () => void;
    cartCount: number;
    getCartItemQuantity: (productId: string) => number | undefined;
    addCartItem: (
        product: ProductDto,
        snapshot: CartItemSnapshot,
    ) => void | Promise<void>;
    incrementCartItem: (productId: string) => void | Promise<void>;
    decrementCartItem: (productId: string) => void | Promise<void>;
    removeCartItem: (productId: string) => void | Promise<void>;
    clearCart: () => void | Promise<void>;
    quantityAdjustmentProductIds: string[];
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
    initialCartState: CartInitialData;
    children: ReactNode;
}

export function CartProvider({
    initialCartState,
    children,
}: CartProviderProps) {
    const [actionQueue] = useState(createActionQueue);

    const cart = useCart({
        initialCartState: initialCartState.cart,
        actionQueue,
    });

    const productIds = useMemo(
        () => cart.items.map((item) => item.productId),
        [cart.items],
    );

    const products = useCartProducts({
        productIds,
        enabled: true,
        initialProducts: initialCartState.products,
    });

    const cartItems = useMemo(
        () =>
            getCartItemsData(
                cart.items,
                products.products,
                products.missingProductIds,
            ),
        [cart.items, products.products, products.missingProductIds],
    );

    const cartSummary = useMemo(() => getCartSummary(cartItems), [cartItems]);

    const [quantityAdjustmentProductIds, setQuantityAdjustmentProductIds] =
        useState<string[]>([]);

    const adjustingProductIdsRef = useRef(new Set<string>());

    const quantityAdjustments = useMemo(
        () => getCartQuantityAdjustments(cartItems),
        [cartItems],
    );

    const { setCartItemQuantity } = cart;

    useEffect(() => {
        if (quantityAdjustments.length === 0) {
            return;
        }

        const adjustQuantities = async () => {
            for (const adjustment of quantityAdjustments) {
                if (adjustingProductIdsRef.current.has(adjustment.productId)) {
                    continue;
                }

                adjustingProductIdsRef.current.add(adjustment.productId);

                try {
                    await setCartItemQuantity(
                        adjustment.productId,
                        adjustment.quantity,
                    );

                    setQuantityAdjustmentProductIds((currentIds) =>
                        currentIds.includes(adjustment.productId)
                            ? currentIds
                            : [...currentIds, adjustment.productId],
                    );
                } catch {
                    // Пока ничего не делаем.
                } finally {
                    adjustingProductIdsRef.current.delete(adjustment.productId);
                }
            }
        };

        void adjustQuantities();
    }, [setCartItemQuantity, quantityAdjustments]);

    const contextValue: CartContextValue = {
        cartItems,
        cartSummary,
        productsState: products.state,
        retryProducts: products.retry,
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
        quantityAdjustmentProductIds,
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

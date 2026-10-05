'use client';

import { useCallback, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import {
    addCartItemAction,
    clearCartAction,
    removeCartItemAction,
    setCartItemQuantityAction,
} from '@/app/(shop)/cart/actions';
import { toast } from '@/components/ui/toast';
import { useOptimisticMutations } from '@/hooks/useOptimisticMutations';
import type { ActionQueue } from '@/lib/async/action-queue';
import type { CartItemSnapshot } from '@/lib/cart/cart.types';
import type { CartData, CartItemDto } from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

interface UseCartOptions {
    initialCartState: CartData;
    actionQueue: ActionQueue;
}

export interface UseCartResult {
    items: CartItemDto[];
    products: CartData['products'];
    addCartItem: (
        product: ProductDto,
        snapshot: CartItemSnapshot,
    ) => Promise<void>;
    incrementCartItem: (productId: string) => void;
    decrementCartItem: (productId: string) => void;
    removeCartItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartCount: number;
    pendingQuantity: PendingQuantity | null;
}

type PendingQuantity = {
    productId: string;
    quantity: number;
};

export function useCart({
    initialCartState,
    actionQueue,
}: UseCartOptions): UseCartResult {
    const [pendingQuantity, setPendingQuantity] =
        useState<PendingQuantity | null>(null);

    const pendingQuantityRef = useRef<PendingQuantity | null>(null);

    const { data: cartData, mutate } = useOptimisticMutations({
        initialData: initialCartState,
        actionQueue,
    });

    const updatePendingQuantity = useCallback(
        (nextPendingQuantity: PendingQuantity | null) => {
            pendingQuantityRef.current = nextPendingQuantity;
            setPendingQuantity(nextPendingQuantity);
        },
        [],
    );

    const saveQuantity = useDebouncedCallback(
        async (productId: string, quantity: number) => {
            try {
                await mutate({
                    update: (data) => ({
                        ...data,
                        cart: {
                            ...data.cart,
                            items: data.cart.items.map((item) =>
                                item.productId === productId
                                    ? {
                                          ...item,
                                          quantity,
                                          quantityAdjustedFrom: null,
                                      }
                                    : item,
                            ),
                        },
                    }),
                    action: () =>
                        setCartItemQuantityAction(productId, quantity),
                });
            } catch {
                toast.add({
                    id: 'cart-quantity-error',
                    description:
                        'Не удалось изменить количество товара в корзине',
                    type: 'error',
                });
            } finally {
                const currentPendingQuantity = pendingQuantityRef.current;

                if (
                    currentPendingQuantity?.productId === productId &&
                    currentPendingQuantity.quantity === quantity
                ) {
                    updatePendingQuantity(null);
                }
            }
        },
        400,
    );

    const addCartItem = useCallback(
        (product: ProductDto, snapshot: CartItemSnapshot) =>
            mutate({
                update: (data) => {
                    const hasItem = data.cart.items.some(
                        (item) => item.productId === product.id,
                    );

                    if (hasItem) {
                        return data;
                    }

                    const hasProduct = data.products.some(
                        (item) => item.productId === product.id,
                    );

                    return {
                        ...data,
                        cart: {
                            ...data.cart,
                            items: [
                                ...data.cart.items,
                                {
                                    productId: product.id,
                                    quantity: 1,
                                    quantityAdjustedFrom: null,
                                    snapshot,
                                },
                            ],
                        },
                        products: hasProduct
                            ? data.products
                            : [
                                  ...data.products,
                                  {
                                      productId: product.id,
                                      title: product.title,
                                      slug: product.slug,
                                      stock: product.stock,
                                      regularPrice: product.regularPrice,
                                      effectivePrice: product.effectivePrice,
                                      discountPercent: product.discountPercent,
                                      measureType: product.measureType,
                                      measureValue: product.measureValue,
                                  },
                              ],
                    };
                },
                action: () => addCartItemAction(product.id, snapshot),
            }),
        [mutate],
    );

    const setPendingItemQuantity = useCallback(
        (productId: string, quantity: number) => {
            const currentPending = pendingQuantityRef.current;

            if (currentPending && currentPending.productId !== productId) {
                saveQuantity.flush();
            }

            updatePendingQuantity({
                productId,
                quantity,
            });

            saveQuantity(productId, quantity);
        },
        [saveQuantity, updatePendingQuantity],
    );

    const getVisibleQuantity = useCallback(
        (productId: string) => {
            const pending = pendingQuantityRef.current;

            if (pending?.productId === productId) {
                return pending.quantity;
            }

            return cartData.cart.items.find(
                (item) => item.productId === productId,
            )?.quantity;
        },
        [cartData.cart.items],
    );

    const incrementCartItem = useCallback(
        (productId: string) => {
            const quantity = getVisibleQuantity(productId);

            if (quantity === undefined) {
                return;
            }

            setPendingItemQuantity(productId, quantity + 1);
        },
        [getVisibleQuantity, setPendingItemQuantity],
    );

    const decrementCartItem = useCallback(
        (productId: string) => {
            const quantity = getVisibleQuantity(productId);

            if (quantity === undefined || quantity <= 1) {
                return;
            }

            setPendingItemQuantity(productId, quantity - 1);
        },
        [getVisibleQuantity, setPendingItemQuantity],
    );

    const removeCartItem = useCallback(
        (productId: string) => {
            if (pendingQuantityRef.current?.productId === productId) {
                saveQuantity.cancel();
                updatePendingQuantity(null);
            }

            return mutate({
                update: (data) => ({
                    ...data,
                    cart: {
                        ...data.cart,
                        items: data.cart.items.filter(
                            (item) => item.productId !== productId,
                        ),
                    },
                }),
                action: () => removeCartItemAction(productId),
            });
        },
        [mutate, saveQuantity, updatePendingQuantity],
    );

    const clearCart = useCallback(() => {
        saveQuantity.cancel();
        updatePendingQuantity(null);

        return mutate({
            update: (data) => ({
                ...data,
                cart: {
                    ...data.cart,
                    items: [],
                },
            }),
            action: clearCartAction,
        });
    }, [mutate, saveQuantity, updatePendingQuantity]);

    const cartCount = cartData.cart.items.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    return {
        items: cartData.cart.items,
        products: cartData.products,
        addCartItem,
        incrementCartItem,
        decrementCartItem,
        removeCartItem,
        clearCart,
        cartCount,
        pendingQuantity,
    };
}

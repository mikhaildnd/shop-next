'use client';

import { useCallback, useRef, useState } from 'react';

import {
    addCartItemAction,
    clearCartAction,
    decrementCartItemAction,
    incrementCartItemAction,
    removeCartItemAction,
} from '@/app/(shop)/cart/actions';
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
    getCartItem: (productId: string) => CartItemDto | undefined;
    incrementCartItem: (productId: string) => Promise<void>;
    decrementCartItem: (productId: string) => Promise<void>;
    removeCartItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartCount: number;
}

type CartMutation = {
    id: number;
    apply: (data: CartData) => CartData;
};

type CartAction = () => Promise<CartData>;

export function useCart({
    initialCartState,
    actionQueue,
}: UseCartOptions): UseCartResult {
    const [cartData, setCartData] = useState(initialCartState);
    const confirmedCartDataRef = useRef(initialCartState);

    const pendingMutationsRef = useRef<CartMutation[]>([]);
    const nextMutationIdRef = useRef(0);

    const updateVisibleCartData = useCallback(() => {
        const nextCartData = pendingMutationsRef.current.reduce(
            (currentCartData, mutation) => mutation.apply(currentCartData),
            confirmedCartDataRef.current,
        );

        setCartData(nextCartData);
    }, []);

    const enqueueMutation = useCallback(
        (mutation: CartMutation, action: CartAction): Promise<void> => {
            pendingMutationsRef.current.push(mutation);
            updateVisibleCartData();

            const execute = async () => {
                try {
                    confirmedCartDataRef.current = await action();
                } finally {
                    pendingMutationsRef.current =
                        pendingMutationsRef.current.filter(
                            (pendingMutation) =>
                                pendingMutation.id !== mutation.id,
                        );

                    updateVisibleCartData();
                }
            };

            return actionQueue.enqueue(execute);
        },
        [actionQueue, updateVisibleCartData],
    );

    const createMutation = useCallback(
        (apply: CartMutation['apply']): CartMutation => ({
            id: nextMutationIdRef.current++,
            apply,
        }),
        [],
    );

    const addCartItem = useCallback(
        (product: ProductDto, snapshot: CartItemSnapshot): Promise<void> =>
            enqueueMutation(
                createMutation((data) => {
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
                                  },
                              ],
                    };
                }),
                () => addCartItemAction(product.id, snapshot),
            ),
        [createMutation, enqueueMutation],
    );

    const getCartItem = useCallback(
        (productId: string) =>
            cartData.cart.items.find((item) => item.productId === productId),
        [cartData.cart.items],
    );

    const incrementCartItem = useCallback(
        (productId: string): Promise<void> =>
            enqueueMutation(
                createMutation((data) => ({
                    ...data,
                    cart: {
                        ...data.cart,
                        items: data.cart.items.map((item) =>
                            item.productId === productId
                                ? {
                                      ...item,
                                      quantity: item.quantity + 1,
                                      quantityAdjustedFrom: null,
                                  }
                                : item,
                        ),
                    },
                })),
                () => incrementCartItemAction(productId),
            ),
        [createMutation, enqueueMutation],
    );

    const decrementCartItem = useCallback(
        (productId: string): Promise<void> =>
            enqueueMutation(
                createMutation((data) => ({
                    ...data,
                    cart: {
                        ...data.cart,
                        items: data.cart.items
                            .map((item) =>
                                item.productId === productId
                                    ? {
                                          ...item,
                                          quantity: item.quantity - 1,
                                          quantityAdjustedFrom: null,
                                      }
                                    : item,
                            )
                            .filter((item) => item.quantity > 0),
                    },
                })),
                () => decrementCartItemAction(productId),
            ),
        [createMutation, enqueueMutation],
    );

    const removeCartItem = useCallback(
        (productId: string): Promise<void> =>
            enqueueMutation(
                createMutation((data) => ({
                    ...data,
                    cart: {
                        ...data.cart,
                        items: data.cart.items.filter(
                            (item) => item.productId !== productId,
                        ),
                    },
                })),
                () => removeCartItemAction(productId),
            ),
        [createMutation, enqueueMutation],
    );

    const clearCart = useCallback(
        (): Promise<void> =>
            enqueueMutation(
                createMutation((data) => ({
                    ...data,
                    cart: {
                        ...data.cart,
                        items: [],
                    },
                })),
                clearCartAction,
            ),
        [createMutation, enqueueMutation],
    );

    const cartCount = cartData.cart.items.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    return {
        items: cartData.cart.items,
        products: cartData.products,
        addCartItem,
        getCartItem,
        incrementCartItem,
        decrementCartItem,
        removeCartItem,
        clearCart,
        cartCount,
    };
}

'use client';

import { useCallback, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import {
    addCartItemAction,
    clearCartAction,
    removeCartItemAction,
    removeCartItemsAction,
    setAllCartItemsSelectionAction,
    setCartItemQuantityAction,
    setCartItemSelectionAction,
    updateCartItemPriceSnapshotsAction,
} from '@/app/(app)/(shop)/cart/actions';
import { toast } from '@/components/ui/toast';
import { useOptimisticMutations } from '@/hooks/useOptimisticMutations';
import { createActionQueue } from '@/lib/async/action-queue';
import type { CartData, CartItemDto } from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

interface UseCartOptions {
    initialCartState: CartData;
}

export interface UseCartResult {
    items: CartItemDto[];
    products: CartData['products'];
    addCartItem: (product: ProductDto) => Promise<void>;
    incrementCartItem: (productId: string) => void;
    decrementCartItem: (productId: string) => void;
    removeCartItem: (productId: string) => Promise<void>;
    removeCartItems: (productIds: string[]) => Promise<void>;
    clearCart: () => Promise<void>;
    cartCount: number;
    pendingQuantity: PendingQuantity | null;
    replaceCartData: (cartData: CartData) => void;
    updateCartItemPriceSnapshots: (productIds: string[]) => Promise<void>;
    setCartItemSelection: (
        productId: string,
        isSelected: boolean,
    ) => Promise<void>;
    setAllCartItemsSelection: (isSelected: boolean) => Promise<void>;
}

type PendingQuantity = {
    productId: string;
    quantity: number;
};

export function useCart({ initialCartState }: UseCartOptions): UseCartResult {
    const [actionQueue] = useState(createActionQueue);

    const [pendingQuantity, setPendingQuantity] =
        useState<PendingQuantity | null>(null);

    const pendingQuantityRef = useRef<PendingQuantity | null>(null);

    const {
        data: cartData,
        mutate,
        replace,
    } = useOptimisticMutations({
        initialData: initialCartState,
        actionQueue,
    });

    const replaceCartData = useCallback(
        (nextCartData: CartData) => {
            replace(nextCartData);
        },
        [replace],
    );

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
        (product: ProductDto) =>
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
                                    isSelected: true,
                                    snapshot: {
                                        effectivePrice: product.effectivePrice,
                                    },
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
                                      imageUrl: product.images[0]?.url ?? null,
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
                action: () => addCartItemAction(product.id),
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
                    products: data.products.filter(
                        (product) => product.productId !== productId,
                    ),
                }),
                action: () => removeCartItemAction(productId),
            });
        },
        [mutate, saveQuantity, updatePendingQuantity],
    );

    const removeCartItems = useCallback(
        (productIds: string[]) => {
            if (productIds.length === 0) {
                return Promise.resolve();
            }

            const productIdSet = new Set(productIds);
            const pendingProductId = pendingQuantityRef.current?.productId;

            if (pendingProductId && productIdSet.has(pendingProductId)) {
                saveQuantity.cancel();
                updatePendingQuantity(null);
            }

            return mutate({
                update: (data) => ({
                    ...data,
                    cart: {
                        ...data.cart,
                        items: data.cart.items.filter(
                            (item) => !productIdSet.has(item.productId),
                        ),
                    },
                    products: data.products.filter(
                        (product) => !productIdSet.has(product.productId),
                    ),
                }),
                action: () => removeCartItemsAction(productIds),
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
                products: [],
            }),
            action: clearCartAction,
        });
    }, [mutate, saveQuantity, updatePendingQuantity]);

    const cartCount = cartData.cart.items.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const updateCartItemPriceSnapshots = useCallback(
        (productIds: string[]) => {
            const confirmations = cartData.cart.items
                .filter((item) => productIds.includes(item.productId))
                .map((item) => {
                    const product = cartData.products.find(
                        (product) => product.productId === item.productId,
                    );

                    return product
                        ? {
                              productId: item.productId,
                              effectivePrice: product.effectivePrice,
                          }
                        : null;
                })
                .filter((confirmation) => confirmation !== null);

            if (confirmations.length === 0) {
                return Promise.resolve();
            }

            return mutate({
                update: (data) => ({
                    ...data,
                    cart: {
                        ...data.cart,
                        items: data.cart.items.map((item) => {
                            const confirmation = confirmations.find(
                                (confirmation) =>
                                    confirmation.productId === item.productId,
                            );

                            if (!confirmation) {
                                return item;
                            }

                            return {
                                ...item,
                                snapshot: {
                                    effectivePrice: confirmation.effectivePrice,
                                },
                            };
                        }),
                    },
                }),
                action: () => updateCartItemPriceSnapshotsAction(confirmations),
            });
        },
        [cartData.cart.items, cartData.products, mutate],
    );

    const setCartItemSelection = useCallback(
        (productId: string, isSelected: boolean) =>
            mutate({
                update: (data) => ({
                    ...data,
                    cart: {
                        ...data.cart,
                        items: data.cart.items.map((item) =>
                            item.productId === productId
                                ? { ...item, isSelected }
                                : item,
                        ),
                    },
                }),
                action: () => setCartItemSelectionAction(productId, isSelected),
            }),
        [mutate],
    );

    const setAllCartItemsSelection = useCallback(
        (isSelected: boolean) =>
            mutate({
                update: (data) => {
                    const availableProductIds = new Set(
                        data.products
                            .filter((product) => product.stock > 0)
                            .map((product) => product.productId),
                    );

                    return {
                        ...data,
                        cart: {
                            ...data.cart,
                            items: data.cart.items.map((item) =>
                                availableProductIds.has(item.productId)
                                    ? { ...item, isSelected }
                                    : item,
                            ),
                        },
                    };
                },
                action: () => setAllCartItemsSelectionAction(isSelected),
            }),
        [mutate],
    );

    return {
        items: cartData.cart.items,
        products: cartData.products,
        addCartItem,
        incrementCartItem,
        decrementCartItem,
        removeCartItem,
        removeCartItems,
        clearCart,
        cartCount,
        pendingQuantity,
        replaceCartData,
        updateCartItemPriceSnapshots,
        setCartItemSelection,
        setAllCartItemsSelection,
    };
}

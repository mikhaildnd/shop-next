'use client';

import { useCallback, useRef, useState } from 'react';

import {
    addCartItemAction,
    clearCartAction,
    decrementCartItemAction,
    incrementCartItemAction,
    removeCartItemAction,
    setCartItemQuantityAction,
} from '@/app/(shop)/cart/actions';
import type { ActionQueue } from '@/lib/async/action-queue';
import type { CartItemSnapshot } from '@/lib/cart/cart.types';
import type { CartDto, CartItemDto } from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

interface UseCartOptions {
    initialCartState: CartDto;
    actionQueue: ActionQueue;
}

export interface UseCartResult {
    items: CartItemDto[];
    addCartItem: (
        product: ProductDto,
        snapshot: CartItemSnapshot,
    ) => Promise<void>;
    incrementCartItem: (productId: string) => Promise<void>;
    decrementCartItem: (productId: string) => Promise<void>;
    setCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
    removeCartItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartCount: number;
    getCartItemQuantity: (productId: string) => number | undefined;
}

type CartMutation = {
    id: number;
    apply: (items: CartItemDto[]) => CartItemDto[];
};

type CartAction = () => Promise<void>;

export function useCart({
    initialCartState,
    actionQueue,
}: UseCartOptions): UseCartResult {
    const [items, setItems] = useState(initialCartState.items);

    const confirmedItemsRef = useRef(initialCartState.items);
    const pendingMutationsRef = useRef<CartMutation[]>([]);
    const nextMutationIdRef = useRef(0);

    const updateVisibleItems = useCallback(() => {
        const nextItems = pendingMutationsRef.current.reduce(
            (currentItems, mutation) => mutation.apply(currentItems),
            confirmedItemsRef.current,
        );

        setItems(nextItems);
    }, []);

    const enqueueMutation = useCallback(
        (mutation: CartMutation, action: CartAction): Promise<void> => {
            pendingMutationsRef.current.push(mutation);
            updateVisibleItems();

            const execute = async () => {
                try {
                    await action();

                    confirmedItemsRef.current = mutation.apply(
                        confirmedItemsRef.current,
                    );
                } finally {
                    pendingMutationsRef.current =
                        pendingMutationsRef.current.filter(
                            (pendingMutation) =>
                                pendingMutation.id !== mutation.id,
                        );

                    updateVisibleItems();
                }
            };

            return actionQueue.enqueue(execute);
        },
        [actionQueue, updateVisibleItems],
    );

    const createMutation = useCallback(
        (apply: CartMutation['apply']): CartMutation => ({
            id: nextMutationIdRef.current++,
            apply,
        }),
        [],
    );

    const getCartItemQuantity = useCallback(
        (productId: string) => {
            const item = items.find((item) => item.productId === productId);

            return item?.quantity;
        },
        [items],
    );

    const addCartItem = useCallback(
        (product: ProductDto, snapshot: CartItemSnapshot): Promise<void> =>
            enqueueMutation(
                createMutation((items) => {
                    if (items.some((item) => item.productId === product.id)) {
                        return items;
                    }

                    return [
                        {
                            productId: product.id,
                            quantity: 1,
                            snapshot,
                        },
                        ...items,
                    ];
                }),
                () => addCartItemAction(product.id, snapshot),
            ),
        [createMutation, enqueueMutation],
    );

    const setCartItemQuantity = useCallback(
        (productId: string, quantity: number): Promise<void> =>
            actionQueue.enqueue(async () => {
                const cart = await setCartItemQuantityAction(
                    productId,
                    quantity,
                );

                confirmedItemsRef.current = cart.items;
                updateVisibleItems();
            }),
        [actionQueue, updateVisibleItems],
    );

    const incrementCartItem = useCallback(
        (productId: string): Promise<void> =>
            enqueueMutation(
                createMutation((items) =>
                    items.map((item) =>
                        item.productId === productId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item,
                    ),
                ),
                () => incrementCartItemAction(productId),
            ),
        [createMutation, enqueueMutation],
    );

    const decrementCartItem = useCallback(
        (productId: string): Promise<void> =>
            enqueueMutation(
                createMutation((items) =>
                    items
                        .map((item) =>
                            item.productId === productId
                                ? { ...item, quantity: item.quantity - 1 }
                                : item,
                        )
                        .filter((item) => item.quantity > 0),
                ),
                () => decrementCartItemAction(productId),
            ),
        [createMutation, enqueueMutation],
    );

    const removeCartItem = useCallback(
        (productId: string): Promise<void> =>
            enqueueMutation(
                createMutation((items) =>
                    items.filter((item) => item.productId !== productId),
                ),
                () => removeCartItemAction(productId),
            ),
        [createMutation, enqueueMutation],
    );

    const clearCart = useCallback(
        (): Promise<void> =>
            enqueueMutation(
                createMutation(() => []),
                clearCartAction,
            ),
        [createMutation, enqueueMutation],
    );

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);

    return {
        items,
        addCartItem,
        setCartItemQuantity,
        incrementCartItem,
        decrementCartItem,
        removeCartItem,
        clearCart,
        cartCount,
        getCartItemQuantity,
    };
}

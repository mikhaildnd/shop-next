'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    useSyncExternalStore,
} from 'react';

import { getProductsByIdsAction } from '@/app/(shop)/cart/actions';
import type { CartProductSnapshot } from '@/lib/cart/cart.types';
import {
    addCartEntry as addCartEntryToStorage,
    clearCart as clearCartStorage,
    decrementCartEntry as decrementCartEntryFromStorage,
    getCartEntries,
    getServerCartEntries,
    incrementCartEntry as incrementCartEntryInStorage,
    removeCartEntry as removeCartEntryFromStorage,
    subscribeToCart,
} from '@/lib/cart/cart-storage';
import type { CartItemDto } from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

export interface UseLocalCartResult {
    items: CartItemDto[];
    addCartItem: (product: ProductDto, snapshot: CartProductSnapshot) => void;
    incrementCartItem: (productId: string) => void;
    decrementCartItem: (productId: string) => void;
    removeCartItem: (productId: string) => void;
    clearCart: () => void;
    cartCount: number;
    getCartItemQuantity: (productId: string) => number | undefined;
    isHydrated: boolean;
    isLoadingItems: boolean;
    isRetryingItems: boolean;
    itemsError: Error | null;
    retryItems: () => void;
}

export function useLocalCart(): UseLocalCartResult {
    const cartEntries = useSyncExternalStore(
        subscribeToCart,
        getCartEntries,
        getServerCartEntries,
    );

    const isHydrated = useSyncExternalStore(
        subscribeToCart,
        () => true,
        () => false,
    );

    const [products, setProducts] = useState<ProductDto[]>([]);
    const [unavailableProductIds, setUnavailableProductIds] = useState<Set<string>>(
        new Set(),
    );
    const [itemsError, setItemsError] = useState<Error | null>(null);
    const [retryAttempt, setRetryAttempt] = useState(0);
    const [isRetryingItems, setIsRetryingItems] = useState(false);

    const productIdsKey = useMemo(
        () =>
            [...cartEntries]
                .map((entry) => entry.productId)
                .sort()
                .join(','),
        [cartEntries],
    );

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        if (productIdsKey.length === 0) {
            return;
        }

        const knownProductIds = new Set(products.map((product) => product.id));
        const missingProductIds = cartEntries
            .map((entry) => entry.productId)
            .filter(
                (productId) =>
                    !knownProductIds.has(productId) &&
                    !unavailableProductIds.has(productId),
            );

        if (missingProductIds.length === 0) {
            return;
        }

        let cancelled = false;

        async function loadProducts() {
            try {
                const nextProducts = await getProductsByIdsAction(
                    missingProductIds,
                );

                if (cancelled) {
                    return;
                }

                setProducts((currentProducts) => {
                    const productById = new Map(
                        currentProducts.map((product) => [product.id, product]),
                    );

                    for (const product of nextProducts) {
                        productById.set(product.id, product);
                    }

                    return [...productById.values()];
                });

                const loadedProductIds = new Set(
                    nextProducts.map((product) => product.id),
                );

                setUnavailableProductIds((currentIds) => {
                    const nextIds = new Set(currentIds);

                    for (const productId of missingProductIds) {
                        if (loadedProductIds.has(productId)) {
                            nextIds.delete(productId);
                        } else {
                            nextIds.add(productId);
                        }
                    }

                    return nextIds;
                });

                setItemsError(null);
            } catch (error) {
                if (!cancelled) {
                    setItemsError(
                        error instanceof Error
                            ? error
                            : new Error(
                                  'Неизвестная ошибка: не удалось загрузить товары',
                              ),
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsRetryingItems(false);
                }
            }
        }

        void loadProducts();

        return () => {
            cancelled = true;
        };
    }, [
        cartEntries,
        isHydrated,
        productIdsKey,
        products,
        retryAttempt,
        unavailableProductIds,
    ]);

    const items = useMemo(
        () =>
            cartEntries
                .filter((entry) => !unavailableProductIds.has(entry.productId))
                .map((entry) => {
                    const product = products.find(
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
                .filter((item): item is CartItemDto => item !== null),
        [cartEntries, products, unavailableProductIds],
    );

    const isLoadingItems =
        isHydrated &&
        cartEntries.some(
            (entry) =>
                !products.some((product) => product.id === entry.productId) &&
                !unavailableProductIds.has(entry.productId),
        );

    const retryItems = useCallback(() => {
        setUnavailableProductIds(new Set());
        setIsRetryingItems(true);
        setRetryAttempt((attempt) => attempt + 1);
    }, []);

    const addCartItem = useCallback(
        (product: ProductDto, snapshot: CartProductSnapshot) => {
            addCartEntryToStorage(product.id, snapshot);
        },
        [],
    );

    const removeCartItem = useCallback((productId: string) => {
        removeCartEntryFromStorage(productId);
    }, []);

    const incrementCartItem = useCallback((productId: string) => {
        incrementCartEntryInStorage(productId);
    }, []);

    const decrementCartItem = useCallback((productId: string) => {
        decrementCartEntryFromStorage(productId);
    }, []);

    const clearCart = useCallback(() => {
        clearCartStorage();
    }, []);

    const getCartItemQuantity = useCallback(
        (productId: string) => {
            const entry = cartEntries.find(
                (entry) => entry.productId === productId,
            );

            return entry?.quantity;
        },
        [cartEntries],
    );

    const cartCount = cartEntries.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    return {
        items,
        addCartItem,
        removeCartItem,
        incrementCartItem,
        decrementCartItem,
        clearCart,
        cartCount,
        getCartItemQuantity,
        isHydrated,
        isLoadingItems,
        isRetryingItems,
        itemsError,
        retryItems,
    };
}

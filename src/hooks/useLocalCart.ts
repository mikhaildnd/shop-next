'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
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
    itemsState: CartItemsState;
    retryItems: () => void;
}

type ProductLoadState =
    | { status: 'idle' }
    | { status: 'loading'; key: string; isRetry: boolean }
    | { status: 'error'; key: string; error: Error };

export type CartItemsState =
    | { status: 'idle' }
    | { status: 'loading'; isRetry: boolean }
    | { status: 'error'; error: Error };

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
    const productsRef = useRef(new Map<string, ProductDto>());
    const [contentState, setContentState] = useState<ProductLoadState>({
        status: 'idle',
    });
    const [retryKey, setRetryKey] = useState(0);
    const handledRetryKeyRef = useRef(0);

    const productIds = useMemo(
        () => cartEntries.map((entry) => entry.productId),
        [cartEntries],
    );

    const productIdsKey = useMemo(
        () => [...productIds].sort().join(','),
        [productIds],
    );

    useEffect(() => {
        if (!isHydrated || productIds.length === 0) {
            return;
        }

        const missingProductIds = productIds.filter(
            (productId) => !productsRef.current.has(productId),
        );
        const isRetry = retryKey !== handledRetryKeyRef.current;

        if (missingProductIds.length === 0 && !isRetry) {
            return;
        }

        let cancelled = false;

        async function loadProducts() {
            setContentState({
                status: 'loading',
                key: productIdsKey,
                isRetry,
            });

            try {
                const nextProducts = await getProductsByIdsAction(
                    missingProductIds.length > 0
                        ? missingProductIds
                        : productIds,
                );

                if (cancelled) {
                    return;
                }

                for (const product of nextProducts) {
                    productsRef.current.set(product.id, product);
                }

                setProducts((currentProducts) => {
                    const nextProductsById = new Map(
                        currentProducts.map((product) => [product.id, product]),
                    );

                    for (const product of nextProducts) {
                        nextProductsById.set(product.id, product);
                    }

                    return [...nextProductsById.values()];
                });

                handledRetryKeyRef.current = retryKey;
                setContentState({ status: 'idle' });
            } catch (error) {
                if (!cancelled) {
                    handledRetryKeyRef.current = retryKey;
                    setContentState({
                        status: 'error',
                        key: productIdsKey,
                        error:
                            error instanceof Error
                                ? error
                                : new Error(
                                      'Неизвестная ошибка: не удалось загрузить товары',
                                  ),
                    });
                }
            }
        }

        void loadProducts();

        return () => {
            cancelled = true;
        };
    }, [isHydrated, productIds, productIdsKey, retryKey]);

    const productsById = useMemo(
        () => new Map(products.map((product) => [product.id, product])),
        [products],
    );

    const items = useMemo(
        () =>
            cartEntries
                .map((entry) => {
                    const product = productsById.get(entry.productId);

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
        [cartEntries, productsById],
    );

    const itemsState: CartItemsState =
        contentState.status !== 'idle' &&
        contentState.key === productIdsKey
            ? contentState.status === 'loading'
                ? { status: 'loading', isRetry: contentState.isRetry }
                : { status: 'error', error: contentState.error }
            : { status: 'idle' };

    const retryItems = useCallback(() => {
        setRetryKey((key) => key + 1);
    }, []);

    const addCartItem = useCallback(
        (product: ProductDto, snapshot: CartProductSnapshot) => {
            productsRef.current.set(product.id, product);
            setProducts((currentProducts) => {
                if (
                    currentProducts.some(
                        (currentProduct) => currentProduct.id === product.id,
                    )
                ) {
                    return currentProducts;
                }

                return [...currentProducts, product];
            });

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
        itemsState,
        retryItems,
    };
}

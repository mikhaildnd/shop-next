'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getCartProductsByIdsAction } from '@/app/(shop)/cart/actions';
import type { CartProduct } from '@/lib/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

export interface UseCartProductsResult {
    products: CartProduct[];
    missingProductIds: string[];
    state: CartProductsState;
    upsertProduct: (product: ProductDto) => void;
    retry: () => void;
}

export type CartProductsState =
    | { status: 'idle' }
    | { status: 'loading'; isRetry: boolean }
    | { status: 'error'; error: Error };

interface UseCartProductsOptions {
    productIds: string[];
    enabled: boolean;
    initialProducts?: CartProduct[];
}

export function useCartProducts({
    productIds,
    enabled,
    initialProducts = [],
}: UseCartProductsOptions): UseCartProductsResult {
    const [products, setProducts] = useState<CartProduct[]>(initialProducts);
    const [missingProductIds, setMissingProductIds] = useState<string[]>([]);
    const resolvedProductIdsRef = useRef(
        new Set(initialProducts.map((product) => product.productId)),
    );
    const missingProductIdsRef = useRef(new Set<string>());
    const [loadState, setLoadState] = useState<
        | { status: 'idle' }
        | { status: 'loading'; key: string; isRetry: boolean }
        | { status: 'error'; key: string; error: Error }
    >({ status: 'idle' });
    const [retryKey, setRetryKey] = useState(0);
    const handledRetryKeyRef = useRef(0);

    const productIdsKey = useMemo(
        () => [...productIds].sort().join(','),
        [productIds],
    );

    useEffect(() => {
        if (!enabled || productIds.length === 0) {
            resolvedProductIdsRef.current.clear();
            missingProductIdsRef.current.clear();

            return;
        }

        const currentProductIds = new Set(productIds);

        for (const productId of resolvedProductIdsRef.current) {
            if (!currentProductIds.has(productId)) {
                resolvedProductIdsRef.current.delete(productId);
            }
        }

        for (const productId of missingProductIdsRef.current) {
            if (!currentProductIds.has(productId)) {
                missingProductIdsRef.current.delete(productId);
            }
        }

        const isRetry = retryKey !== handledRetryKeyRef.current;
        const idsToLoad = isRetry
            ? productIds
            : productIds.filter(
                  (productId) => !resolvedProductIdsRef.current.has(productId),
              );

        if (idsToLoad.length === 0) {
            return;
        }

        let cancelled = false;

        async function loadProducts() {
            setLoadState({
                status: 'loading',
                key: productIdsKey,
                isRetry,
            });

            try {
                const nextProducts =
                    await getCartProductsByIdsAction(idsToLoad);

                if (cancelled) {
                    return;
                }

                const loadedProductIds = new Set(
                    nextProducts.map((product) => product.productId),
                );

                if (isRetry) {
                    for (const productId of productIds) {
                        resolvedProductIdsRef.current.delete(productId);
                        missingProductIdsRef.current.delete(productId);
                    }
                }

                for (const productId of idsToLoad) {
                    resolvedProductIdsRef.current.add(productId);

                    if (loadedProductIds.has(productId)) {
                        missingProductIdsRef.current.delete(productId);
                    } else {
                        missingProductIdsRef.current.add(productId);
                    }
                }

                setProducts((currentProducts) => {
                    const nextProductsById = new Map(
                        currentProducts.map((product) => [
                            product.productId,
                            product,
                        ]),
                    );

                    for (const productId of idsToLoad) {
                        if (!loadedProductIds.has(productId)) {
                            nextProductsById.delete(productId);
                        }
                    }

                    for (const product of nextProducts) {
                        nextProductsById.set(product.productId, product);
                    }

                    return [...nextProductsById.values()].filter((product) =>
                        currentProductIds.has(product.productId),
                    );
                });

                setMissingProductIds(
                    [...missingProductIdsRef.current].filter((productId) =>
                        currentProductIds.has(productId),
                    ),
                );

                handledRetryKeyRef.current = retryKey;
                setLoadState({ status: 'idle' });
            } catch (error) {
                if (!cancelled) {
                    handledRetryKeyRef.current = retryKey;
                    setLoadState({
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
    }, [enabled, productIds, productIdsKey, retryKey]);

    const upsertProduct = useCallback((product: ProductDto) => {
        const cartProduct: CartProduct = {
            productId: product.id,
            title: product.title,
            slug: product.slug,
            stock: product.stock,
            regularPrice: product.regularPrice,
            effectivePrice: product.effectivePrice,
            discountPercent: product.discountPercent,
        };

        resolvedProductIdsRef.current.add(product.id);
        missingProductIdsRef.current.delete(product.id);

        setProducts((currentProducts) => {
            const nextProductsById = new Map(
                currentProducts.map((currentProduct) => [
                    currentProduct.productId,
                    currentProduct,
                ]),
            );

            nextProductsById.set(product.id, cartProduct);

            return [...nextProductsById.values()];
        });

        setMissingProductIds((currentMissingProductIds) =>
            currentMissingProductIds.filter(
                (productId) => productId !== product.id,
            ),
        );
    }, []);

    const retry = useCallback(() => {
        setRetryKey((key) => key + 1);
    }, []);

    const state: CartProductsState =
        loadState.status !== 'idle' && loadState.key === productIdsKey
            ? loadState.status === 'loading'
                ? { status: 'loading', isRetry: loadState.isRetry }
                : { status: 'error', error: loadState.error }
            : { status: 'idle' };

    const currentProductIds = new Set(productIds);

    const visibleProducts = products.filter((product) =>
        currentProductIds.has(product.productId),
    );

    const visibleMissingProductIds = missingProductIds.filter((productId) =>
        currentProductIds.has(productId),
    );

    return {
        products: visibleProducts,
        missingProductIds: visibleMissingProductIds,
        state,
        upsertProduct,
        retry,
    };
}

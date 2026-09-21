'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getCartProductsByIdsAction } from '@/app/(shop)/cart/actions';
import type {
    CartProductLookup,
} from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

export interface UseCartProductsResult {
    products: CartProductLookup[];
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
    initialProducts?: CartProductLookup[];
}

export function useCartProducts({
    productIds,
    enabled,
    initialProducts = [],
}: UseCartProductsOptions): UseCartProductsResult {
    const [products, setProducts] =
        useState<CartProductLookup[]>(initialProducts);
    const productsRef = useRef(
        new Map(
            initialProducts.map((product) => [product.productId, product]),
        ),
    );
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
            setLoadState({
                status: 'loading',
                key: productIdsKey,
                isRetry,
            });

            try {
                const nextProducts = await getCartProductsByIdsAction(
                    missingProductIds.length > 0
                        ? missingProductIds
                        : productIds,
                );

                if (cancelled) {
                    return;
                }

                for (const product of nextProducts) {
                    productsRef.current.set(product.productId, product);
                }

                setProducts((currentProducts) => {
                    const nextProductsById = new Map(
                        currentProducts.map((product) => [
                            product.productId,
                            product,
                        ]),
                    );

                    for (const product of nextProducts) {
                        nextProductsById.set(product.productId, product);
                    }

                    return [...nextProductsById.values()];
                });

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
        const cartProduct: CartProductLookup = {
            productId: product.id,
            title: product.title,
            slug: product.slug,
            stock: product.stock,
            regularPrice: product.regularPrice,
            effectivePrice: product.effectivePrice,
            discountPercent: product.discountPercent,
        };

        productsRef.current.set(product.id, cartProduct);

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

    return {
        products,
        state,
        upsertProduct,
        retry,
    };
}

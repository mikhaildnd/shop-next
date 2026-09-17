'use client';

import { useEffect, useMemo, useState } from 'react';

import { getProductsByIdsAction } from '@/app/(shop)/cart/actions';
import type { CartEntry } from '@/lib/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

interface UseCartProductsOptions {
    cartEntries: CartEntry[];
    initialProducts?: ProductDto[];
    isHydrated?: boolean;
}

export interface UseCartProductsResult {
    products: ProductDto[];
    isLoadingProducts: boolean;
    productsError: Error | null;
    retryProducts: () => void;
}

export function useCartProducts({
    cartEntries,
    initialProducts = [],
    isHydrated = true,
}: UseCartProductsOptions): UseCartProductsResult {
    const [products, setProducts] = useState<ProductDto[]>(initialProducts);
    const [productsError, setProductsError] = useState<Error | null>(null);
    const [retryAttempt, setRetryAttempt] = useState(0);

    const productIdsKey = useMemo(
        () =>
            [...cartEntries]
                .map((entry) => entry.productId)
                .sort()
                .join(','),
        [cartEntries],
    );

    useEffect(() => {
        if (!isHydrated || productIdsKey.length === 0) {
            return;
        }

        const knownProductIds = new Set(products.map((product) => product.id));
        const missingProductIds = cartEntries
            .map((entry) => entry.productId)
            .filter((productId) => !knownProductIds.has(productId));

        if (missingProductIds.length === 0) {
            return;
        }

        let cancelled = false;

        async function loadProducts() {
            setProductsError(null);

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
            } catch (error) {
                if (!cancelled) {
                    setProductsError(
                        error instanceof Error
                            ? error
                            : new Error('Не удалось загрузить товары'),
                    );
                }
            }
        }

        void loadProducts();

        return () => {
            cancelled = true;
        };
    }, [cartEntries, isHydrated, productIdsKey, products, retryAttempt]);

    const isLoadingProducts =
        isHydrated &&
        cartEntries.some(
            (entry) => !products.some((product) => product.id === entry.productId),
        );

    function retryProducts() {
        setRetryAttempt((attempt) => attempt + 1);
    }

    return {
        products,
        isLoadingProducts,
        productsError,
        retryProducts,
    };
}

'use client';

import { useEffect, useEffectEvent, useMemo, useState } from 'react';

import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { getProductsByIdsAction } from '@/app/(shop)/cart/actions';
import { useLocalCart } from '@/hooks/useLocalCart';
import type { ProductDto } from '@/services/product/product.types';

export function ClientCartContent() {
    const { cartEntries, isHydrated } = useLocalCart();

    const [products, setProducts] = useState<ProductDto[]>();

    const productIdsKey = [...cartEntries]
        .map((item) => item.productId)
        .sort()
        .join(',');

    const loadProducts = useEffectEvent(async () => {
        return getProductsByIdsAction(
            cartEntries.map((item) => item.productId),
        );
    });

    useEffect(() => {
        if (!isHydrated || productIdsKey.length === 0) {
            return;
        }

        let cancelled = false;

        async function load() {
            const nextProducts = await loadProducts();

            if (!cancelled) {
                setProducts(nextProducts);
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [isHydrated, productIdsKey]);

    const productsById = useMemo(
        () => new Map(products?.map((product) => [product.id, product])),
        [products],
    );

    const items = useMemo(
        () =>
            cartEntries.flatMap(({ productId, quantity }) => {
                const product = productsById.get(productId);

                return product ? [{ product, quantity }] : [];
            }),
        [cartEntries, productsById],
    );

    if (!isHydrated || (cartEntries.length > 0 && products === undefined)) {
        return null;
    }

    if (items.length === 0) {
        return null;
    }

    return <CartItems items={items} />;
}

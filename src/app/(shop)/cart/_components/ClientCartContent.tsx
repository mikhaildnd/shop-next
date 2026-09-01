'use client';

import { useEffect, useEffectEvent, useMemo, useState } from 'react';

import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { getProductsByIdsAction } from '@/app/(shop)/cart/actions';
import { useCartContext } from '@/components/cart/CartContext';
import type { ProductDto } from '@/services/product/product.types';

export function ClientCartContent() {
    const { cartEntries } = useCartContext();

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
        if (productIdsKey.length === 0) {
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
    }, [productIdsKey]);

    const productsById = useMemo(
        () => new Map(products?.map((product) => [product.id, product])),
        [products],
    );

    const items = useMemo(
        () =>
            cartEntries.flatMap(({ productId, quantity, snapshot }) => {
                const product = productsById.get(productId);

                return product ? [{ product, quantity, snapshot }] : [];
            }),
        [cartEntries, productsById],
    );

    if (cartEntries.length > 0 && products === undefined) {
        return null;
    }

    if (items.length === 0) {
        return null;
    }

    return <CartItems items={items} />;
}

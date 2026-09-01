'use client';

import { useEffect, useEffectEvent, useMemo, useState } from 'react';

import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { getProductsByIdsAction } from '@/app/(shop)/cart/actions';
import { ButtonLink } from '@/components/button/ButtonLink';
import { useCartContext } from '@/components/cart/CartContext';
import { PageMessage } from '@/components/PageMessage';
import { routes } from '@/routes';
import type { ProductDto } from '@/services/product/product.types';

export function CartContent() {
    const { cartEntries, initialCartItems } = useCartContext();

    const [products, setProducts] = useState<ProductDto[]>(
        initialCartItems.map(({ product }) => product),
    );

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
        () => new Map(products.map((product) => [product.id, product])),
        [products],
    );

    const items = useMemo(
        () =>
            cartEntries.map((entry) => ({
                ...entry,
                product: productsById.get(entry.productId),
            })),
        [cartEntries, productsById],
    );

    if (cartEntries.length === 0) {
        return (
            <PageMessage
                title="Корзина пуста"
                description="Добавьте товары в корзину, чтобы оформить заказ"
            >
                <ButtonLink href={routes.catalogPage()}>В каталог</ButtonLink>
            </PageMessage>
        );
    }

    return <CartItems items={items} />;
}

'use client';

import { useMemo } from 'react';

import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { useCartContext } from '@/components/cart/CartContext';

export function ServerCartContent() {
    const { cartEntries, initialCartItems } = useCartContext();

    const productsById = useMemo(
        () =>
            new Map(
                initialCartItems.map(({ product }) => [product.id, product]),
            ),
        [initialCartItems],
    );

    const items = useMemo(
        () =>
            cartEntries.flatMap(({ productId, quantity }) => {
                const product = productsById.get(productId);

                return product ? [{ product, quantity }] : [];
            }),
        [cartEntries, productsById],
    );

    return <CartItems items={items} />;
}

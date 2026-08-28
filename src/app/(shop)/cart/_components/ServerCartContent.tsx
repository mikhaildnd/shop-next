'use client';

import { useMemo } from 'react';

import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { useCartContext } from '@/components/cart/CartContext';

export function ServerCartContent() {
    const { cartEntries, initialCartState } = useCartContext();

    const initialItems = initialCartState.items;

    const productsById = useMemo(
        () => new Map(initialItems.map(({ product }) => [product.id, product])),
        [initialItems],
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

'use client';

import { useEffect, useEffectEvent, useMemo, useState } from 'react';

import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { CartItemSkeleton } from '@/app/(shop)/cart/_components/CartItemSkeleton';
import { CartSummary } from '@/app/(shop)/cart/_components/CartSummary';
import { getProductsByIdsAction } from '@/app/(shop)/cart/actions';
import { ButtonLink } from '@/components/button/ButtonLink';
import { useCartContext } from '@/components/cart/CartContext';
import { PageMessage } from '@/components/PageMessage';
import { routes } from '@/routes';
import type { ProductDto } from '@/services/product/product.types';

interface CartContentProps {
    className?: string;
}

export function CartContent({ className }: CartContentProps) {
    const { cartEntries, initialCartItems, isHydrated, cartCount } =
        useCartContext();

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

    const isLoadingProducts = items.some((item) => !item.product);

    const regularPriceTotal = items.reduce(
        (sum, item) => sum + (item.product?.regularPrice ?? 0) * item.quantity,
        0,
    );

    const effectivePriceTotal = items.reduce(
        (sum, item) =>
            sum + (item.product?.effectivePrice ?? 0) * item.quantity,
        0,
    );

    const discountAmount = regularPriceTotal - effectivePriceTotal;

    const hasPriceChanges = items.some(
        (item) =>
            item.product &&
            item.snapshot.effectivePrice !== item.product.effectivePrice,
    );

    if (!isHydrated) {
        return (
            <div className="flex flex-col divide-y divide-gray-200 rounded bg-white">
                {Array.from({ length: 3 }, (_, index) => (
                    <CartItemSkeleton key={index} />
                ))}
            </div>
        );
    }

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

    return (
        <div className={className}>
            {hasPriceChanges && (
                <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 shadow-md">
                    <p className="font-semibold">
                        Цена некоторых товаров изменилась
                    </p>
                    <p className="mt-1">
                        Проверьте цены перед оформлением заказа.
                    </p>
                </div>
            )}

            <div className="grid items-start gap-6 lg:grid-cols-3">
                <CartItems
                    items={items}
                    className="lg:col-span-2"
                />

                {!isLoadingProducts && (
                    <CartSummary
                        cartCount={cartCount}
                        regularPriceTotal={regularPriceTotal}
                        discountAmount={discountAmount}
                        effectivePriceTotal={effectivePriceTotal}
                    />
                )}
            </div>
        </div>
    );
}

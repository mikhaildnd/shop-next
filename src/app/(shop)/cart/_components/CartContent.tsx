'use client';

import { useMemo } from 'react';

import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { CartItemSkeleton } from '@/app/(shop)/cart/_components/CartItemSkeleton';
import { CartSummary } from '@/app/(shop)/cart/_components/CartSummary';
import { ButtonLink } from '@/components/button/ButtonLink';
import { useCartContext } from '@/components/cart/CartContext';
import { PageMessage } from '@/components/PageMessage';
import { routes } from '@/routes';
import type { CartItemDto } from '@/services/cart/cart.types';

interface CartContentProps {
    className?: string;
}

export function CartContent({ className }: CartContentProps) {
    const { cartEntries, products, isLoadingProducts, isHydrated } =
        useCartContext();

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

    const availableItems = items.filter((item) => item.product.stock > 0);

    const unavailableItems = items.filter((item) => item.product.stock === 0);

    const regularPriceTotal = availableItems.reduce(
        (sum, item) => sum + item.product.regularPrice * item.quantity,
        0,
    );

    const effectivePriceTotal = availableItems.reduce(
        (sum, item) => sum + item.product.effectivePrice * item.quantity,
        0,
    );

    const availableCartCount = availableItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );

    const discountAmount = regularPriceTotal - effectivePriceTotal;

    const hasPriceChanges = items.some(
        (item) =>
            item.product &&
            item.snapshot.effectivePrice !== item.product.effectivePrice,
    );

    const hasStockIssues = items.some(
        (item) =>
            item.product &&
            item.product.stock > 0 &&
            item.quantity > item.product.stock,
    );

    const isCheckoutDisabled = availableItems.length === 0 || hasStockIssues;

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

    if (isLoadingProducts) {
        return (
            <div className="flex flex-col divide-y divide-gray-200 rounded bg-white">
                {Array.from({ length: cartEntries.length }, (_, index) => (
                    <CartItemSkeleton key={index} />
                ))}
            </div>
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
                    availableItems={availableItems}
                    unavailableItems={unavailableItems}
                    className="lg:col-span-2"
                />

                <CartSummary
                    cartCount={availableCartCount}
                    regularPriceTotal={regularPriceTotal}
                    discountAmount={discountAmount}
                    effectivePriceTotal={effectivePriceTotal}
                    isCheckoutDisabled={isCheckoutDisabled}
                />
            </div>
        </div>
    );
}

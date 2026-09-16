'use client';

import { useMemo } from 'react';

import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { CartItemSkeleton } from '@/app/(shop)/cart/_components/CartItemSkeleton';
import { CartSummary } from '@/app/(shop)/cart/_components/CartSummary';
import { ButtonLink } from '@/components/button/ButtonLink';
import { useCartContext } from '@/components/cart/CartContext';
import { PageMessage } from '@/components/PageMessage';
import { getCartSummary } from '@/lib/cart/get-cart-summary';
import { routes } from '@/routes';
import type { CartItemDto } from '@/services/cart/cart.types';

export function GuestCartContent() {
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

    const {
        availableItems,
        unavailableItems,
        regularPriceTotal,
        effectivePriceTotal,
        availableCartCount,
        discountAmount,
        hasPriceChanges,
        isCheckoutDisabled,
    } = getCartSummary(items);

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
        <div>
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

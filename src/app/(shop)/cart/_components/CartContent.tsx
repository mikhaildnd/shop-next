'use client';

import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { CartItemSkeleton } from '@/app/(shop)/cart/_components/CartItemSkeleton';
import { CartSummary } from '@/app/(shop)/cart/_components/CartSummary';
import { CartSummarySkeleton } from '@/app/(shop)/cart/_components/CartSummarySkeleton';
import { ButtonLink } from '@/components/button/ButtonLink';
import { LoadingButton } from '@/components/button/LoadingButton';
import { useCartContext } from '@/components/cart/CartContext';
import { PageMessage } from '@/components/PageMessage';
import { getCartItemsData } from '@/lib/cart/get-cart-items-data';
import { getCartSummary } from '@/lib/cart/get-cart-summary';
import { routes } from '@/routes';

export function CartContent() {
    const {
        cartEntries,
        products,
        missingProductIds,
        isHydrated,
        productsState,
        retryProducts,
    } = useCartContext();

    const isRetrying =
        productsState.status === 'loading' && productsState.isRetry;

    if (!isHydrated) {
        return (
            <div className="grid items-start gap-6 lg:grid-cols-3">
                <div className="flex flex-col divide-y divide-gray-200 rounded bg-white lg:col-span-2">
                    {Array.from({ length: 3 }, (_, index) => (
                        <CartItemSkeleton key={index} />
                    ))}
                </div>

                <CartSummarySkeleton />
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

    if (productsState.status === 'error' || isRetrying) {
        return (
            <PageMessage
                title="Не удалось загрузить товары"
                description="Попробуйте загрузить товары ещё раз"
            >
                <LoadingButton
                    isLoading={isRetrying}
                    pendingText="Загрузка..."
                    onClick={retryProducts}
                >
                    Повторить
                </LoadingButton>
            </PageMessage>
        );
    }

    const items = getCartItemsData(cartEntries, products, missingProductIds);
    const isSummaryLoading = productsState.status === 'loading';

    const {
        regularPriceTotal,
        effectivePriceTotal,
        availableCartCount,
        discountAmount,
        hasPriceChanges,
        isCheckoutDisabled,
    } = getCartSummary(items);

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
                    entries={cartEntries}
                    products={products}
                    className="lg:col-span-2"
                />

                <CartSummary
                    cartCount={availableCartCount}
                    regularPriceTotal={regularPriceTotal}
                    discountAmount={discountAmount}
                    effectivePriceTotal={effectivePriceTotal}
                    isCheckoutDisabled={isCheckoutDisabled}
                    isLoading={isSummaryLoading}
                />
            </div>
        </div>
    );
}

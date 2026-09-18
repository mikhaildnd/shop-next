'use client';

import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { CartItemSkeleton } from '@/app/(shop)/cart/_components/CartItemSkeleton';
import { CartSummary } from '@/app/(shop)/cart/_components/CartSummary';
import { useCartContext } from '@/components/cart/CartContext';
import { LoadingButton } from '@/components/button/LoadingButton';
import { ButtonLink } from '@/components/button/ButtonLink';
import { PageMessage } from '@/components/PageMessage';
import { getCartSummary } from '@/lib/cart/get-cart-summary';
import { routes } from '@/routes';

export function CartContent() {
    const {
        items,
        itemsState,
        retryItems,
        isHydrated,
    } = useCartContext();

    const cartItemCount = items.length;

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

    if (items.length === 0 && itemsState.status === 'idle') {
        return (
            <PageMessage
                title="Корзина пуста"
                description="Добавьте товары в корзину, чтобы оформить заказ"
            >
                <ButtonLink href={routes.catalogPage()}>В каталог</ButtonLink>
            </PageMessage>
        );
    }

    if (itemsState.status === 'error') {
        return (
            <PageMessage
                title="Не удалось загрузить товары"
                description="Попробуйте загрузить товары ещё раз"
            >
                <LoadingButton
                    isLoading={false}
                    pendingText="Загрузка..."
                    onClick={retryItems}
                >
                    Повторить
                </LoadingButton>
            </PageMessage>
        );
    }

    if (itemsState.status === 'loading' && itemsState.isRetry) {
        return (
            <PageMessage
                title="Не удалось загрузить товары"
                description="Попробуйте загрузить товары ещё раз"
            >
                <LoadingButton
                    isLoading
                    pendingText="Загрузка..."
                    onClick={retryItems}
                >
                    Повторить
                </LoadingButton>
            </PageMessage>
        );
    }

    if (itemsState.status === 'loading') {
        return (
            <div className="flex flex-col divide-y divide-gray-200 rounded bg-white">
                {Array.from({ length: cartItemCount || 3 }, (_, index) => (
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

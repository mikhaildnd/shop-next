'use client';

import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { CartSummaryDesktop } from '@/app/(shop)/cart/_components/CartSummaryDesktop';
import { CartSummaryMobile } from '@/app/(shop)/cart/_components/CartSummaryMobile';
import { ButtonLink } from '@/components/button/ButtonLink';
import { useCartContext } from '@/components/cart/CartContext';
import { PageMessage } from '@/components/PageMessage';
import { routes } from '@/routes';

export function CartContent() {
    const { cartItems, cartSummary, isHydrated } = useCartContext();

    if (isHydrated && cartItems.length === 0) {
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
        <div>
            {cartSummary.hasPriceChanges && (
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
                <CartItems className="lg:col-span-2" />

                <CartSummaryDesktop className="hidden lg:flex" />

                <CartSummaryMobile className="lg:hidden" />
            </div>
        </div>
    );
}

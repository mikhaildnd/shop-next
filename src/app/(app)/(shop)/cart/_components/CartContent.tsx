'use client';

import { CartItems } from '@/app/(app)/(shop)/cart/_components/CartItems';
import { CartSummaryDesktop } from '@/app/(app)/(shop)/cart/_components/CartSummaryDesktop';
import { CartSummaryMobile } from '@/app/(app)/(shop)/cart/_components/CartSummaryMobile';
import { ButtonLink } from '@/components/button/ButtonLink';
import { useCartContext } from '@/components/cart/CartContext';
import { PageMessage } from '@/components/PageMessage';
import { routes } from '@/routes';

export function CartContent() {
    const { cartItems } = useCartContext();

    if (cartItems.length === 0) {
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
        <div className="grid items-start gap-6 lg:grid-cols-3">
            <CartItems className="lg:col-span-2" />

            <CartSummaryDesktop className="hidden lg:flex" />

            <CartSummaryMobile className="lg:hidden" />
        </div>
    );
}

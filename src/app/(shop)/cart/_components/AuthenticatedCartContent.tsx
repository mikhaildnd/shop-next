import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { CartSummary } from '@/app/(shop)/cart/_components/CartSummary';
import { ButtonLink } from '@/components/button/ButtonLink';
import { PageMessage } from '@/components/PageMessage';
import { getCartSummary } from '@/lib/cart/get-cart-summary';
import { routes } from '@/routes';
import { getCart } from '@/services/cart/cart.service';

interface AuthenticatedCartContentProps {
    userId: string;
}

export async function AuthenticatedCartContent({
    userId,
}: AuthenticatedCartContentProps) {
    const cart = await getCart(userId);
    const { items } = cart;

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

    if (items.length === 0) {
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

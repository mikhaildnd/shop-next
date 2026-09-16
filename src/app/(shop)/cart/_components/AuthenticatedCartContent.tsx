import { CartItems } from '@/app/(shop)/cart/_components/CartItems';
import { CartSummary } from '@/app/(shop)/cart/_components/CartSummary';
import { ButtonLink } from '@/components/button/ButtonLink';
import { PageMessage } from '@/components/PageMessage';
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
        (item) => item.snapshot.effectivePrice !== item.product.effectivePrice,
    );

    const hasStockIssues = items.some(
        (item) =>
            item.product.stock > 0 && item.quantity > item.product.stock,
    );

    const isCheckoutDisabled = availableItems.length === 0 || hasStockIssues;

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

import { useCartContext } from '@/components/cart/CartContext';
import { formatPrice } from '@/lib/format-price';

export function SummaryDetails() {
    const { cartSummary } = useCartContext();

    return (
        <div className="flex flex-col gap-2 text-[#414141]">
            <h3 className="text-xl font-semibold">Ваша корзина</h3>

            <div className="flex justify-between">
                <span>Количество товаров</span>
                <span>{cartSummary.availableCartCount}</span>
            </div>

            <div className="flex justify-between">
                <span>Стоимость</span>
                <span>{formatPrice(cartSummary.regularPriceTotal)} ₸</span>
            </div>

            <div className="flex justify-between">
                <span>Скидка</span>
                <span>-{formatPrice(cartSummary.discountAmount)} ₸</span>
            </div>

            <div className="mt-6 flex justify-between gap-4">
                <span className="text-xl font-semibold">Итого:</span>
                <span className="text-lg font-semibold">
                    {formatPrice(cartSummary.effectivePriceTotal)} ₸
                </span>
            </div>
        </div>
    );
}

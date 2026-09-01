import { CartItem } from '@/app/(shop)/cart/_components/CartItem';
import { CartItemSkeleton } from '@/app/(shop)/cart/_components/CartItemSkeleton';
import type { CartEntry } from '@/lib/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

type CartListItem = CartEntry & {
    product?: ProductDto;
};

interface CartItemsProps {
    items: CartListItem[];
}

export function CartItems({ items }: CartItemsProps) {
    const hasPriceChanges = items.some(
        (item) =>
            item.product &&
            item.snapshot.effectivePrice !== item.product.effectivePrice,
    );

    return (
        <>
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

            <div className="flex flex-col divide-y divide-gray-200 rounded bg-white">
                {items.map((item) =>
                    item.product ? (
                        <CartItem
                            key={item.productId}
                            item={{
                                product: item.product,
                                quantity: item.quantity,
                                snapshot: item.snapshot,
                            }}
                        />
                    ) : (
                        <CartItemSkeleton key={item.productId} />
                    ),
                )}
            </div>
        </>
    );
}

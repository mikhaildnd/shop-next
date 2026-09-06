import { CartItem } from '@/app/(shop)/cart/_components/CartItem';
import { CartItemSkeleton } from '@/app/(shop)/cart/_components/CartItemSkeleton';
import type { CartEntry } from '@/lib/cart/cart.types';
import { cn } from '@/lib/cn';
import type { ProductDto } from '@/services/product/product.types';

type CartListItem = CartEntry & {
    product?: ProductDto;
};

interface CartItemsProps {
    availableItems: CartListItem[];
    unavailableItems: CartListItem[];
    className?: string;
}

export function CartItems({
    availableItems,
    unavailableItems,
    className,
}: CartItemsProps) {
    return (
        <div className={cn('flex flex-col gap-6', className)}>
            <div className="flex flex-col divide-y divide-gray-200">
                {availableItems.map((item) =>
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

            {unavailableItems.length > 0 && (
                <div className="flex flex-col">
                    <p className="text-md mb-2 font-semibold">
                        Недоступны для заказа
                    </p>

                    <div className="flex flex-col divide-y divide-gray-200">
                        {unavailableItems.map((item) => (
                            <CartItem
                                key={item.productId}
                                item={{
                                    product: item.product!,
                                    quantity: item.quantity,
                                    snapshot: item.snapshot,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

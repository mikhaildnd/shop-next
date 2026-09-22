import { CartItem } from '@/app/(shop)/cart/_components/CartItem';
import { cn } from '@/lib/cn';
import type { CartItemData } from '@/lib/cart/cart.types';

interface CartItemsProps {
    availableItems: CartItemData[];
    unavailableItems: CartItemData[];
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
                {availableItems.map((item) => (
                    <CartItem
                        key={item.productId}
                        item={item}
                    />
                ))}
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
                                item={item}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

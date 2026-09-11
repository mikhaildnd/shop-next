import { CartItem } from '@/app/(shop)/cart/_components/CartItem';
import { cn } from '@/lib/cn';
import type { CartItemDto } from '@/services/cart/cart.types';

interface CartItemsProps {
    availableItems: CartItemDto[];
    unavailableItems: CartItemDto[];
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
                        key={item.product.id}
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
                                key={item.product.id}
                                item={item}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

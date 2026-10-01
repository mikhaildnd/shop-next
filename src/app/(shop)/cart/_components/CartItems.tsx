import { CartItem } from '@/app/(shop)/cart/_components/CartItem';
import { useCartContext } from '@/components/cart/CartContext';
import { cn } from '@/lib/cn';

interface CartItemsProps {
    className?: string;
}

export function CartItems({ className }: CartItemsProps) {
    const { cartItems } = useCartContext();

    const availableItems = cartItems.filter((item) => {
        return !item.product || item.product.stock > 0;
    });

    const unavailableItems = cartItems.filter((item) => {
        return item.product?.stock === 0;
    });

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

import { CartItem } from '@/app/(app)/(shop)/cart/_components/CartItem/CartItem';
import { CartPriceChangesDialog } from '@/app/(app)/(shop)/cart/_components/CartPriceChangesDialog';
import { CartPriceChangesMessage } from '@/app/(app)/(shop)/cart/_components/CartPriceChangesMessage';
import { useCartContext } from '@/components/cart/CartContext';
import { cn } from '@/lib/cn';

interface CartItemsProps {
    className?: string;
}

export function CartItems({ className }: CartItemsProps) {
    const { availableCartItems, unavailableCartItems, hasPriceChanges } =
        useCartContext();

    const changedPriceProducts = availableCartItems.filter(
        (item) => item.product.effectivePrice !== item.snapshot.effectivePrice,
    );

    return (
        <div className={cn('flex flex-col gap-6', className)}>
            <div className="flex flex-col">
                {hasPriceChanges && (
                    <CartPriceChangesMessage>
                        <CartPriceChangesDialog
                            cartItems={changedPriceProducts}
                        />
                    </CartPriceChangesMessage>
                )}

                <p className="text-md font-semibold">Доступны для заказа</p>

                <div className="flex flex-col divide-y divide-gray-200">
                    {availableCartItems.map((item) => (
                        <CartItem
                            key={item.productId}
                            item={item}
                        />
                    ))}
                </div>
            </div>

            {unavailableCartItems.length > 0 && (
                <div className="flex flex-col">
                    <p className="text-md font-semibold">
                        Недоступны для заказа
                    </p>

                    <div className="flex flex-col divide-y divide-gray-200">
                        {unavailableCartItems.map((item) => (
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

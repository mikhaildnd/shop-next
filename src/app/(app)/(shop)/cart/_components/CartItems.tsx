import { CartItem } from '@/app/(app)/(shop)/cart/_components/CartItem/CartItem';
import { CartPriceChangesDialog } from '@/app/(app)/(shop)/cart/_components/CartPriceChangesDialog';
import { CartPriceChangesMessage } from '@/app/(app)/(shop)/cart/_components/CartPriceChangesMessage';
import { useCartContext } from '@/components/cart/CartContext';
import { Checkbox } from '@/components/form/Checkbox';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/cn';

interface CartItemsProps {
    className?: string;
}

export function CartItems({ className }: CartItemsProps) {
    const {
        availableCartItems,
        unavailableCartItems,
        hasPriceChanges,
        updateCartItemPriceSnapshots,
        setAllCartItemsSelection,
    } = useCartContext();

    const changedPriceProducts = availableCartItems.filter(
        (item) => item.product.effectivePrice !== item.snapshot.effectivePrice,
    );

    const areAllSelected =
        availableCartItems.length > 0 &&
        availableCartItems.every((item) => item.isSelected);

    const handleToggleAll = async () => {
        try {
            await setAllCartItemsSelection(!areAllSelected);
        } catch {
            toast.add({
                id: 'cart-selection-error',
                type: 'error',
                description:
                    'Не удалось изменить выбор товаров. Попробуйте ещё раз.',
            });
        }
    };

    const handleConfirmPriceChanges = async () => {
        try {
            await updateCartItemPriceSnapshots(
                changedPriceProducts.map((item) => item.productId),
            );
        } catch {
            toast.add({
                id: 'cart-price-changes-error',
                type: 'error',
                description: 'Произошла ошибка. Попробуйте ещё раз.',
            });
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)}>
            <div className="flex flex-col">
                {hasPriceChanges && (
                    <CartPriceChangesMessage
                        onClose={handleConfirmPriceChanges}
                    >
                        <CartPriceChangesDialog
                            cartItems={changedPriceProducts}
                        />
                    </CartPriceChangesMessage>
                )}

                <div className="mb-3 py-2">
                    <Checkbox
                        id="cart-select-all"
                        checked={areAllSelected}
                        onChange={handleToggleAll}
                        label="Выбрать все"
                    />
                </div>

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

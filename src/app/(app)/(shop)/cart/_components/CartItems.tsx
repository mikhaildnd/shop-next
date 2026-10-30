'use client';

import { useState } from 'react';

import { CartItem } from '@/app/(app)/(shop)/cart/_components/CartItem/CartItem';
import { CartItemRemoveButton } from '@/app/(app)/(shop)/cart/_components/CartItemRemoveButton';
import { CartPriceChangesMessage } from '@/app/(app)/(shop)/cart/_components/CartPriceChangesMessage';
import { useCartContext } from '@/components/cart/CartContext';
import { DeletionDialog } from '@/components/DeletionDialog';
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
        updateCartItemPriceSnapshots,
        setAllCartItemsSelection,
        removeCartItems,
    } = useCartContext();

    const changedPriceProducts = availableCartItems.filter(
        (item) => item.product.effectivePrice !== item.snapshot.effectivePrice,
    );

    const areAllSelected =
        availableCartItems.length > 0 &&
        availableCartItems.every((item) => item.isSelected);

    const selectedProductIds = availableCartItems
        .filter((item) => item.isSelected)
        .map((item) => item.productId);

    const [isPriceChangesMessageVisible, setIsPriceChangesMessageVisible] =
        useState(true);

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

    const handleRemoveSelected = async () => {
        try {
            await removeCartItems(selectedProductIds);
        } catch {
            toast.add({
                id: 'cart-remove-selected-error',
                type: 'error',
                description:
                    'Не удалось удалить выбранные товары. Попробуйте ещё раз.',
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
                description:
                    'Не удалось подтвердить новые цены. Попробуйте ещё раз.',
            });
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)}>
            <div className="flex flex-col">
                {changedPriceProducts.length > 0 &&
                    isPriceChangesMessageVisible && (
                        <CartPriceChangesMessage
                            className="mb-4"
                            onConfirm={handleConfirmPriceChanges}
                            onClose={() =>
                                setIsPriceChangesMessageVisible(false)
                            }
                            cartItems={changedPriceProducts}
                        />
                    )}

                <div className="mb-3 flex items-center justify-between py-2">
                    <Checkbox
                        variant="cart"
                        id="cart-select-all"
                        checked={areAllSelected}
                        onChange={handleToggleAll}
                        label="Выбрать все"
                    />

                    <DeletionDialog
                        trigger={
                            <CartItemRemoveButton
                                className="bg-gray-50"
                                size="sm"
                                shape="rounded"
                                disabled={selectedProductIds.length === 0}
                            />
                        }
                        title="Удалить выбранные товары?"
                        description="Выбранные товары будут удалены из корзины. Это действие нельзя отменить."
                        confirmLabel="Удалить"
                        onConfirm={handleRemoveSelected}
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

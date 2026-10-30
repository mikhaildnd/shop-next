'use client';

import { useState } from 'react';

import { useCartContext } from '@/components/cart/CartContext';
import { DeletionDialog } from '@/components/DeletionDialog';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/cn';
import {
    controlHeightClasses,
    type ControlSize,
    controlSizeClasses,
} from '@/lib/ui/ui-styles';

type CartItemQuantityVariant = 'primary' | 'neutral';

const variantClasses: Record<CartItemQuantityVariant, string> = {
    neutral: 'border border-gray-50',
    primary: 'border border-(--color-primary)/15',
};

const buttonVariantClasses: Record<CartItemQuantityVariant, string> = {
    neutral:
        'bg-gray-50 text-gray-500 hover:bg-gray-100 active:bg-gray-200 disabled:hover:bg-gray-50 disabled:active:bg-gray-50',
    primary:
        'bg-(--color-primary)/15 text-(--color-primary) hover:bg-(--color-primary)/20 active:bg-(--color-primary)/30 disabled:hover:bg-(--color-primary)/15 disabled:active:bg-(--color-primary)/15',
};

interface CartItemQuantityProps {
    productId: string;
    quantity: number;
    maxQuantity?: number;
    size?: ControlSize;
    variant?: CartItemQuantityVariant;
    confirmRemoval?: boolean;
    className?: string;
}
export function CartItemQuantity({
    productId,
    quantity,
    maxQuantity,
    size = 'md',
    variant = 'primary',
    confirmRemoval = false,
    className,
}: CartItemQuantityProps) {
    const { incrementCartItem, decrementCartItem, removeCartItem } =
        useCartContext();

    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

    const disabled = maxQuantity === undefined;

    const isIncrementDisabled = disabled || quantity >= maxQuantity;

    const handleDecrement = async () => {
        if (quantity === 1) {
            if (confirmRemoval) {
                setIsRemoveDialogOpen(true);
            } else {
                await handleRemove();
            }

            return;
        }

        decrementCartItem(productId);
    };

    async function handleRemove() {
        try {
            await removeCartItem(productId);
        } catch {
            toast.add({
                id: 'cart-remove-error',
                type: 'error',
                description: 'Не удалось удалить товар. Попробуйте ещё раз.',
            });
        }
    }

    return (
        <div
            className={cn(
                'flex items-center justify-between rounded-md',
                controlHeightClasses[size],
                variantClasses[variant],
                className,
            )}
        >
            <button
                type="button"
                disabled={disabled}
                className={cn(
                    'button-base rounded-l-md focus-ring',
                    controlSizeClasses[size],
                    buttonVariantClasses[variant],
                )}
                onClick={handleDecrement}
            >
                −
            </button>
            <span className="text-md flex min-w-10 items-center justify-center text-gray-500">
                {quantity}
            </span>

            <button
                // Firefox persists the disabled state without autocomplete="off".
                // @ts-expect-error — autoComplete is valid HTML for button but missing from React types.
                autoComplete="off"
                type="button"
                disabled={isIncrementDisabled}
                className={cn(
                    'button-base rounded-r-md focus-ring',
                    controlSizeClasses[size],
                    buttonVariantClasses[variant],
                )}
                onClick={() => incrementCartItem(productId)}
            >
                +
            </button>

            {confirmRemoval && (
                <DeletionDialog
                    open={isRemoveDialogOpen}
                    onOpenChange={setIsRemoveDialogOpen}
                    title="Удалить товар?"
                    description="Товар будет удалён из корзины."
                    onConfirm={handleRemove}
                />
            )}
        </div>
    );
}

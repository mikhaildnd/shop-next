'use client';

import { useState } from 'react';

import { useCartContext } from '@/components/cart/CartContext';
import { DeletionDialog } from '@/components/DeletionDialog';
import { cn } from '@/lib/cn';

type CartItemQuantitySize = 'sm' | 'md';

type CartItemQuantityVariant = 'primary' | 'neutral';

const sizeClasses: Record<CartItemQuantitySize, string> = {
    sm: 'h-8',
    md: 'h-10',
};

const buttonSizeClasses: Record<CartItemQuantitySize, string> = {
    sm: 'px-3',
    md: 'px-4',
};

const variantClasses: Record<CartItemQuantityVariant, string> = {
    neutral: 'border border-gray-100',
    primary: 'border border-(--color-primary)',
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
    size?: CartItemQuantitySize;
    variant?: CartItemQuantityVariant;
    className?: string;
}
export function CartItemQuantity({
    productId,
    quantity,
    maxQuantity,
    size = 'md',
    variant = 'primary',
    className,
}: CartItemQuantityProps) {
    const { incrementCartItem, decrementCartItem, removeCartItem } =
        useCartContext();

    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

    const disabled = maxQuantity === undefined;

    const isIncrementDisabled = disabled || quantity >= maxQuantity;

    const handleDecrement = async () => {
        if (quantity === 1) {
            setIsRemoveDialogOpen(true);
            return;
        }

        decrementCartItem(productId);
    };

    return (
        <div
            className={cn(
                'flex items-center justify-between overflow-clip rounded',
                sizeClasses[size],
                variantClasses[variant],
                className,
            )}
        >
            <button
                type="button"
                disabled={disabled}
                className={cn(
                    'flex h-full items-center justify-between disabled:cursor-not-allowed disabled:opacity-50',
                    buttonSizeClasses[size],
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
                    'flex h-full items-center justify-between disabled:cursor-not-allowed disabled:opacity-50',
                    buttonSizeClasses[size],
                    buttonVariantClasses[variant],
                )}
                onClick={() => incrementCartItem(productId)}
            >
                +
            </button>
            <DeletionDialog
                open={isRemoveDialogOpen}
                onOpenChange={setIsRemoveDialogOpen}
                title="Удалить товар?"
                description="Товар будет удалён из корзины."
                onConfirm={() => removeCartItem(productId)}
            />
        </div>
    );
}

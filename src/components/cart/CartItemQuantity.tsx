'use client';

import { useCartContext } from '@/components/cart/CartContext';
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
    maxQuantity: number;
    size?: CartItemQuantitySize;
    variant?: CartItemQuantityVariant;
    className?: string;
}
export function CartItemQuantity({
    productId,
    maxQuantity,
    size = 'md',
    variant = 'primary',
    className,
}: CartItemQuantityProps) {
    const { incrementCartEntry, decrementCartEntry, getCartEntryQuantity } =
        useCartContext();

    const quantity = getCartEntryQuantity(productId);

    if (quantity === undefined) {
        return null;
    }

    const isIncrementDisabled = quantity >= maxQuantity;

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
                className={cn(
                    'flex h-full items-center justify-between',
                    buttonSizeClasses[size],
                    buttonVariantClasses[variant],
                )}
                onClick={() => decrementCartEntry(productId)}
            >
                −
            </button>

            <span className="text-md flex min-w-10 items-center justify-center text-gray-500">
                {quantity}
            </span>

            <button
                type="button"
                disabled={isIncrementDisabled}
                className={cn(
                    'flex h-full items-center justify-between disabled:cursor-not-allowed disabled:opacity-50',
                    buttonSizeClasses[size],
                    buttonVariantClasses[variant],
                )}
                onClick={() => incrementCartEntry(productId)}
            >
                +
            </button>
        </div>
    );
}

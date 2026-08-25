'use client';

import { Button } from '@/components/button/Button';
import { useCartContext } from '@/components/cart/CartContext';
import { cn } from '@/lib/cn';

interface CartButtonProps {
    productId: string;
    className?: string;
}

export function CartButton({ productId, className }: CartButtonProps) {
    const {
        addCartItem,
        getCartItemQuantity,
        decrementCartItem,
        incrementCartItem,
    } = useCartContext();

    const quantity = getCartItemQuantity(productId);

    if (quantity > 0) {
        return (
            <div
                className={cn(
                    'flex h-10 items-center justify-between overflow-clip rounded border border-(--color-primary)',
                    className,
                )}
            >
                <button
                    className="flex h-full cursor-pointer items-center justify-between bg-(--color-primary)/15 px-4 text-(--color-primary) hover:bg-(--color-primary)/40 active:bg-(--color-primary)/35"
                    type="button"
                    onClick={() => decrementCartItem(productId)}
                >
                    −
                </button>

                <span className="text-md">{quantity}</span>

                <button
                    className="flex h-full cursor-pointer items-center justify-between bg-(--color-primary)/15 px-4 text-(--color-primary) hover:bg-(--color-primary)/40 active:bg-(--color-primary)/35"
                    type="button"
                    onClick={() => incrementCartItem(productId)}
                >
                    +
                </button>
            </div>
        );
    }

    return (
        <Button
            className={className}
            onClick={() => addCartItem(productId)}
            variant="accent"
        >
            В корзину
        </Button>
    );
}

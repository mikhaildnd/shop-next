'use client';

import { Button } from '@/components/button/Button';
import { useCartContext } from '@/components/cart/CartContext';
import { CartItemQuantity } from '@/components/cart/CartItemQuantity';

interface CartButtonProps {
    productId: string;
    className?: string;
}

export function CartButton({ productId, className }: CartButtonProps) {
    const { addCartEntry, getCartEntryQuantity } = useCartContext();

    const isInCart = getCartEntryQuantity(productId) !== undefined;

    if (isInCart) {
        return <CartItemQuantity productId={productId} />;
    }

    return (
        <Button
            className={className}
            onClick={() => addCartEntry(productId)}
            variant="accent"
        >
            В корзину
        </Button>
    );
}

'use client';

import { Button } from '@/components/button/Button';
import { useCartContext } from '@/components/cart/CartContext';
import { CartItemQuantity } from '@/components/cart/CartItemQuantity';
import type { ProductDto } from '@/services/product/product.types';

interface CartButtonProps {
    product: ProductDto;
    className?: string;
}

export function CartButton({ product, className }: CartButtonProps) {
    const { addCartEntry, getCartEntryQuantity } = useCartContext();

    const isInCart = getCartEntryQuantity(product.id) !== undefined;

    if (isInCart) {
        return <CartItemQuantity productId={product.id} />;
    }

    return (
        <Button
            className={className}
            onClick={() =>
                addCartEntry(product.id, {
                    effectivePrice: product.effectivePrice,
                })
            }
            variant="accent"
        >
            В корзину
        </Button>
    );
}

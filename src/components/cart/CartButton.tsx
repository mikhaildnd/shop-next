'use client';

import { Button } from '@/components/button/Button';
import { useCartContext } from '@/components/cart/CartContext';
import { CartItemQuantity } from '@/components/cart/CartItemQuantity';
import type { ProductDto } from '@/services/product/product.types';
import { cn } from '@/lib/cn';

interface CartButtonProps {
    product: ProductDto;
    className?: string;
}

export function CartButton({ product, className }: CartButtonProps) {
    const { addCartEntry, getCartEntryQuantity } = useCartContext();

    const isOutOfStock = product.stock === 0;
    const isInCart = getCartEntryQuantity(product.id) !== undefined;

    return (
        <div className={cn('flex w-full', className)}>
            {isInCart && !isOutOfStock ? (
                <CartItemQuantity
                    className="flex-1"
                    productId={product.id}
                    maxQuantity={product.stock}
                />
            ) : (
                <Button
                    className="flex-1"
                    disabled={isOutOfStock}
                    onClick={
                        isOutOfStock
                            ? undefined
                            : () =>
                                  addCartEntry(product.id, {
                                      effectivePrice: product.effectivePrice,
                                  })
                    }
                    variant="accent"
                >
                    {isOutOfStock ? 'Нет в наличии' : 'В корзину'}
                </Button>
            )}
        </div>
    );
}

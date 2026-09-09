'use client';

import { Button } from '@/components/button/Button';
import { useCartContext } from '@/components/cart/CartContext';
import { CartItemQuantity } from '@/components/cart/CartItemQuantity';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/cn';
import type { ProductDto } from '@/services/product/product.types';

interface CartButtonProps {
    product: ProductDto;
    className?: string;
}

export function CartButton({ product, className }: CartButtonProps) {
    const { addCartEntry, getCartEntryQuantity } = useCartContext();

    const isOutOfStock = product.stock === 0;
    const isInCart = getCartEntryQuantity(product.id) !== undefined;

    const handleAddCartEntry = async () => {
        try {
            await addCartEntry(product.id, {
                effectivePrice: product.effectivePrice,
            });
        } catch {
            toast.add({
                id: 'cart-add-error',
                description: 'Не удалось добавить товар в корзину',
                type: 'error',
            });
        }
    };

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
                    onClick={isOutOfStock ? undefined : handleAddCartEntry}
                    variant="accent"
                >
                    {isOutOfStock ? 'Нет в наличии' : 'В корзину'}
                </Button>
            )}
        </div>
    );
}

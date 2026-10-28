'use client';

import { Button } from '@/components/button/Button';
import { useCartContext } from '@/components/cart/CartContext';
import { CartItemQuantity } from '@/components/cart/CartItemQuantity';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/cn';
import type { ControlSize } from '@/lib/ui/ui-styles';
import type { ProductDto } from '@/services/product/product.types';

interface CartButtonProps {
    product: ProductDto;
    size?: ControlSize;
    className?: string;
}

export function CartButton({
    product,
    size = 'md',
    className,
}: CartButtonProps) {
    const { addCartItem, getCartItem } = useCartContext();

    const cartItem = getCartItem(product.id);

    const isOutOfStock = product.stock === 0;
    const isInCart = cartItem !== undefined;

    const handleAddCartItem = async () => {
        try {
            await addCartItem(product);
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
                    size={size}
                    productId={product.id}
                    quantity={cartItem.displayQuantity}
                    maxQuantity={product.stock}
                />
            ) : (
                <Button
                    className="flex-1"
                    size={size}
                    disabled={isOutOfStock}
                    onClick={isOutOfStock ? undefined : handleAddCartItem}
                    variant="accent"
                >
                    {isOutOfStock ? 'Нет в наличии' : 'В корзину'}
                </Button>
            )}
        </div>
    );
}

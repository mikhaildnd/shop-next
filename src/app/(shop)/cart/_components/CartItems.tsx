import { CartItem } from '@/app/(shop)/cart/_components/CartItem';
import { CartItemSkeleton } from '@/app/(shop)/cart/_components/CartItemSkeleton';
import type { CartEntry } from '@/lib/cart/cart.types';
import { cn } from '@/lib/cn';
import type { ProductDto } from '@/services/product/product.types';

type CartListItem = CartEntry & {
    product?: ProductDto;
};

interface CartItemsProps {
    items: CartListItem[];
    className?: string;
}

export function CartItems({ items, className }: CartItemsProps) {
    return (
        <div
            className={cn('flex flex-col divide-y divide-gray-200', className)}
        >
            {items.map((item) =>
                item.product ? (
                    <CartItem
                        key={item.productId}
                        item={{
                            product: item.product,
                            quantity: item.quantity,
                            snapshot: item.snapshot,
                        }}
                    />
                ) : (
                    <CartItemSkeleton key={item.productId} />
                ),
            )}
        </div>
    );
}

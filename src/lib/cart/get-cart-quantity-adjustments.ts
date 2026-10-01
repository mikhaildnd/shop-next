import type { CartItemData } from '@/lib/cart/cart.types';

interface CartQuantityAdjustment {
    productId: string;
    quantity: number;
}

export function getCartQuantityAdjustments(
    items: CartItemData[],
): CartQuantityAdjustment[] {
    return items.flatMap((item) => {
        if (!item.product || item.product.stock <= 0) {
            return [];
        }

        if (item.quantity <= item.product.stock) {
            return [];
        }

        return [
            {
                productId: item.productId,
                quantity: item.product.stock,
            },
        ];
    });
}

import type { CartProduct } from '@/lib/cart/cart.types';
import type {
    CartDto,
    CartQuantityAdjustment,
} from '@/services/cart/cart.types';

export function getCartQuantityAdjustments(
    cart: CartDto,
    products: CartProduct[],
): CartQuantityAdjustment[] {
    const productsById = new Map(
        products.map((product) => [product.productId, product]),
    );

    return cart.items.flatMap((item): CartQuantityAdjustment[] => {
        const product = productsById.get(item.productId);

        if (!product || product.stock <= 0) {
            return [];
        }

        if (item.quantity > product.stock) {
            return [
                {
                    productId: item.productId,
                    quantity: product.stock,
                    quantityAdjustedFrom: item.quantity,
                },
            ];
        }

        if (
            item.quantityAdjustedFrom !== null &&
            product.stock >= item.quantityAdjustedFrom
        ) {
            return [
                {
                    productId: item.productId,
                    quantity: item.quantity,
                    quantityAdjustedFrom: null,
                },
            ];
        }

        return [];
    });
}

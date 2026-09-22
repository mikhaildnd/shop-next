import type { CartItemData } from '@/lib/cart/cart.types';
import type { CartItemDto, CartProductLookup } from '@/services/cart/cart.types';

export function getCartItemsData(
    items: CartItemDto[],
    products: CartProductLookup[],
): CartItemData[] {
    const productsById = new Map(
        products.map((product) => [product.productId, product]),
    );

    return items.flatMap((item) => {
        const product = productsById.get(item.productId);

        if (!product) {
            return [];
        }

        return [{ ...item, product }];
    });
}

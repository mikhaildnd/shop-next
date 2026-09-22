import type { CartEntry, CartItemData } from '@/lib/cart/cart.types';
import type { CartProductLookup } from '@/services/cart/cart.types';

export function getCartItemsData(
    entries: CartEntry[],
    products: CartProductLookup[],
): CartItemData[] {
    const productsById = new Map(
        products.map((product) => [product.productId, product]),
    );

    return entries.flatMap((entry) => {
        const product = productsById.get(entry.productId);

        if (!product) {
            return [];
        }

        return [{ ...entry, product }];
    });
}

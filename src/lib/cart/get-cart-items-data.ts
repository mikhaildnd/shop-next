import type { CartEntry, CartItemData } from '@/lib/cart/cart.types';
import type { CartProductLookup } from '@/services/cart/cart.types';

export function getCartItemsData(
    entries: CartEntry[],
    products: CartProductLookup[],
    missingProductIds: string[],
): CartItemData[] {
    const productsById = new Map(
        products.map((product) => [product.productId, product]),
    );
    const missingProductIdsSet = new Set(missingProductIds);

    return entries.map((entry) => ({
        ...entry,
        product: missingProductIdsSet.has(entry.productId)
            ? null
            : (productsById.get(entry.productId) ?? null),
    }));
}

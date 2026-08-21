import { getFavoriteProductIds } from '@/services/favorite/favorite.service';
import type { ProductFilters } from '@/services/product/filters/filter.types';
import { getProducts } from '@/services/product/product.service';
import type {
    ProductListingItemDto,
    ProductsResponse,
} from '@/services/product/product.types';
import type { ProductSort } from '@/services/product/sort/sort.types';

type GetProductsForListingParams = {
    userId?: string;
    take?: number;
    skip?: number;
    filters?: ProductFilters;
    sort: ProductSort;
    categorySlugs?: string[];
    collectionSlug?: string;
};

type ProductsForListingResponse = Omit<ProductsResponse, 'products'> & {
    products: ProductListingItemDto[];
};

export async function getProductsForListing({
    userId,
    ...params
}: GetProductsForListingParams): Promise<ProductsForListingResponse> {
    const result = await getProducts(params);

    if (result.products.length === 0) {
        return {
            ...result,
            products: [],
        };
    }

    if (!userId) {
        return {
            ...result,
            products: result.products.map((product) => ({
                ...product,
                isFavorite: false,
            })),
        };
    }

    const productIds = result.products.map(({ id }) => id);

    const favoriteIds = await getFavoriteProductIds(userId, productIds);

    const favoriteIdSet = new Set(favoriteIds);

    return {
        ...result,
        products: result.products.map((product) => ({
            ...product,
            isFavorite: favoriteIdSet.has(product.id),
        })),
    };
}

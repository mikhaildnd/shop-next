import type { ProductFilters } from '@/lib/product-listing/filters/types';
import type { ProductListingStats } from '@/services/product/product.types';

type GetProductFilterVisibilityOptions = {
    listingStats: ProductListingStats;
    filters: ProductFilters;
};

export type ProductFilterVisibility = {
    price: boolean;
    discount: boolean;
    sale: boolean;
    inStock: boolean;
};

export function getProductFilterVisibility({
    listingStats,
    filters,
}: GetProductFilterVisibilityOptions): ProductFilterVisibility {
    return {
        price: true,
        discount: filters.discount !== null || listingStats.maxDiscount > 0,
        sale: filters.sale || listingStats.hasSaleProducts,
        inStock: true,
    };
}

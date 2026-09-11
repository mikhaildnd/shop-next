import { getProductFilterDefaults } from '@/app/(shop)/(catalog)/lib/product-listing/get-product-filter-defaults';
import {
    PRODUCT_FILTER_PARAMS,
    PRODUCT_SORT_PARAM,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductListingState } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import type { ProductFilters } from '@/services/product/filters/filter.types';
import { DEFAULT_PRODUCT_SORT } from '@/services/product/sort/sort.constants';

type AppendProductListingSearchParamsOptions = {
    params: URLSearchParams;
    listing: ProductListingState;
    defaultFilterOverrides?: Partial<ProductFilters>;
};

export function appendProductListingSearchParams({
    params,
    listing,
    defaultFilterOverrides,
}: AppendProductListingSearchParamsOptions) {
    const { sort, filters } = listing;

    const defaults = getProductFilterDefaults(defaultFilterOverrides);

    params.delete(PRODUCT_SORT_PARAM);

    params.delete(PRODUCT_FILTER_PARAMS.SALE);
    params.delete(PRODUCT_FILTER_PARAMS.IN_STOCK);
    params.delete(PRODUCT_FILTER_PARAMS.DISCOUNT);
    params.delete(PRODUCT_FILTER_PARAMS.PRICE_FROM);
    params.delete(PRODUCT_FILTER_PARAMS.PRICE_TO);

    if (sort !== DEFAULT_PRODUCT_SORT) {
        params.set(PRODUCT_SORT_PARAM, sort);
    }

    if (filters.sale !== defaults.sale) {
        params.set(PRODUCT_FILTER_PARAMS.SALE, String(filters.sale));
    }

    if (filters.inStock !== defaults.inStock) {
        params.set(PRODUCT_FILTER_PARAMS.IN_STOCK, String(filters.inStock));
    }

    if (filters.discount !== defaults.discount) {
        params.set(PRODUCT_FILTER_PARAMS.DISCOUNT, String(filters.discount));
    }

    if (filters.priceFrom !== defaults.priceFrom) {
        params.set(PRODUCT_FILTER_PARAMS.PRICE_FROM, String(filters.priceFrom));
    }

    if (filters.priceTo !== defaults.priceTo) {
        params.set(PRODUCT_FILTER_PARAMS.PRICE_TO, String(filters.priceTo));
    }
}

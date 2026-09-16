import {
    PRODUCT_FILTER_PARAMS,
    PRODUCT_SORT_PARAM,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductListingState } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { removeProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/remove-product-listing-search-params';
import type { ProductFilters } from '@/services/product/filters/filter.types';
import { DEFAULT_PRODUCT_SORT } from '@/services/product/sort/sort.constants';

type AppendProductListingSearchParamsOptions = {
    params: URLSearchParams;
    listing: ProductListingState;
    defaultFilters: ProductFilters;
};

export function appendProductListingSearchParams({
    params,
    listing,
    defaultFilters,
}: AppendProductListingSearchParamsOptions) {
    const { sort, filters } = listing;

    removeProductListingSearchParams(params);

    if (sort !== DEFAULT_PRODUCT_SORT) {
        params.set(PRODUCT_SORT_PARAM, sort);
    }

    if (filters.sale !== defaultFilters.sale) {
        params.set(PRODUCT_FILTER_PARAMS.SALE, String(filters.sale));
    }

    if (filters.inStock !== defaultFilters.inStock) {
        params.set(PRODUCT_FILTER_PARAMS.IN_STOCK, String(filters.inStock));
    }

    if (filters.discount !== defaultFilters.discount) {
        params.set(PRODUCT_FILTER_PARAMS.DISCOUNT, String(filters.discount));
    }

    if (filters.priceFrom !== defaultFilters.priceFrom) {
        params.set(PRODUCT_FILTER_PARAMS.PRICE_FROM, String(filters.priceFrom));
    }

    if (filters.priceTo !== defaultFilters.priceTo) {
        params.set(PRODUCT_FILTER_PARAMS.PRICE_TO, String(filters.priceTo));
    }
}

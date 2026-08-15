import {
    PRODUCT_FILTER_PARAMS,
    PRODUCT_SORT_PARAM,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ParsedProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { DEFAULT_PRODUCT_FILTERS } from '@/services/product/filters/filter.constants';
import { DEFAULT_PRODUCT_SORT } from '@/services/product/sort/sort.constants';

type AppendProductListingSearchParamsOptions = {
    params: URLSearchParams;
    listing: ParsedProductListing;
};

export function appendProductListingSearchParams({
    params,
    listing,
}: AppendProductListingSearchParamsOptions) {
    const { sort, filters } = listing;

    params.delete(PRODUCT_SORT_PARAM);

    params.delete(PRODUCT_FILTER_PARAMS.SALE);
    params.delete(PRODUCT_FILTER_PARAMS.IN_STOCK);
    params.delete(PRODUCT_FILTER_PARAMS.DISCOUNT);
    params.delete(PRODUCT_FILTER_PARAMS.PRICE_FROM);
    params.delete(PRODUCT_FILTER_PARAMS.PRICE_TO);

    if (sort !== DEFAULT_PRODUCT_SORT) {
        params.set(PRODUCT_SORT_PARAM, sort);
    }

    if (filters.sale !== DEFAULT_PRODUCT_FILTERS.sale) {
        params.set(PRODUCT_FILTER_PARAMS.SALE, String(filters.sale));
    }

    if (filters.inStock !== DEFAULT_PRODUCT_FILTERS.inStock) {
        params.set(PRODUCT_FILTER_PARAMS.IN_STOCK, String(filters.inStock));
    }

    if (filters.discount !== DEFAULT_PRODUCT_FILTERS.discount) {
        params.set(PRODUCT_FILTER_PARAMS.DISCOUNT, String(filters.discount));
    }

    if (filters.priceFrom !== DEFAULT_PRODUCT_FILTERS.priceFrom) {
        params.set(PRODUCT_FILTER_PARAMS.PRICE_FROM, String(filters.priceFrom));
    }

    if (filters.priceTo !== DEFAULT_PRODUCT_FILTERS.priceTo) {
        params.set(PRODUCT_FILTER_PARAMS.PRICE_TO, String(filters.priceTo));
    }
}

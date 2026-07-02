import {
    DEFAULT_PRODUCT_SORT,
    PRODUCT_SORT_PARAM,
} from '@/lib/product-listing/sort/consts';
import { PRODUCT_FILTER_PARAMS } from '@/lib/product-listing/filters/consts';
import type { ParsedProductListing } from '@/lib/product-listing/types';

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

    if (filters.sale) {
        params.set(PRODUCT_FILTER_PARAMS.SALE, String(filters.sale));
    }

    if (filters.inStock) {
        params.set(PRODUCT_FILTER_PARAMS.IN_STOCK, String(filters.inStock));
    }

    if (filters.discount !== null) {
        params.set(PRODUCT_FILTER_PARAMS.DISCOUNT, String(filters.discount));
    }

    if (filters.priceFrom !== null) {
        params.set(PRODUCT_FILTER_PARAMS.PRICE_FROM, String(filters.priceFrom));
    }

    if (filters.priceTo !== null) {
        params.set(PRODUCT_FILTER_PARAMS.PRICE_TO, String(filters.priceTo));
    }
}

import type { ProductSearchParams } from '@/lib/product-listing/types';
import type { SearchParams } from '@/lib/url/types';
import { PRODUCT_SORT_PARAM } from '@/lib/product-listing/sort/consts';
import { PRODUCT_FILTER_PARAMS } from '@/lib/product-listing/filters/consts';

export function getProductSearchParams(
    searchParams: SearchParams,
): ProductSearchParams {
    return {
        sort: searchParams.get(PRODUCT_SORT_PARAM) ?? undefined,

        sale: searchParams.get(PRODUCT_FILTER_PARAMS.SALE) ?? undefined,
        discount: searchParams.get(PRODUCT_FILTER_PARAMS.DISCOUNT) ?? undefined,
        priceFrom:
            searchParams.get(PRODUCT_FILTER_PARAMS.PRICE_FROM) ?? undefined,
        priceTo: searchParams.get(PRODUCT_FILTER_PARAMS.PRICE_TO) ?? undefined,
        inStock: searchParams.get(PRODUCT_FILTER_PARAMS.IN_STOCK) ?? undefined,
    };
}

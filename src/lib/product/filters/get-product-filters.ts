import type { ProductFilters } from '@/lib/product/filters/types';
import type { ProductSearchParams } from '@/lib/product/types';
import { normalizeSaleParam } from '@/lib/product/filters/normalize/normalize-sale-param';
import { normalizeDiscountParam } from '@/lib/product/filters/normalize/normalize-discount-param';
import { normalizePriceParam } from '@/lib/product/filters/normalize/normalize-price-param';
import { normalizeQueryParam } from '@/lib/product/filters/normalize/normalize-query-param';
import { SEARCH_QUERY_PARAM } from '@/lib/search/consts';
import { normalizeInStockParam } from '@/lib/product/filters/normalize/normalize-in-stock-param';

export function getProductFilters(
    searchParams: ProductSearchParams,
): ProductFilters {
    return {
        query: normalizeQueryParam(searchParams[SEARCH_QUERY_PARAM]),
        sale: normalizeSaleParam(searchParams.sale),
        discount: normalizeDiscountParam(searchParams.discount),
        priceFrom: normalizePriceParam(searchParams.priceFrom),
        priceTo: normalizePriceParam(searchParams.priceTo),
        inStock: normalizeInStockParam(searchParams.inStock),
    };
}

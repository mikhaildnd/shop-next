import type { ProductSearchParams } from '@/lib/product-listing/types';
import { getProductFilters } from '@/lib/product-listing/filters/get-product-filters';
import { normalizeSortParam } from '@/lib/product-listing/sort/normalize/normalize-sort-param';
import type { ProductFilters } from '@/lib/product-listing/filters/types';
import type { ProductSort } from '@/lib/product-listing/sort/types';

export interface ParsedProductListing {
    filters: ProductFilters;
    sort: ProductSort;
}

export function parseProductListing(
    searchParams: ProductSearchParams = {},
): ParsedProductListing {
    return {
        filters: getProductFilters(searchParams),
        sort: normalizeSortParam(searchParams.sort),
    };
}

import type {
    ParsedProductListing,
    ProductSearchParams,
} from '@/lib/product-listing/types';
import { parseProductFilters } from '@/lib/product-listing/filters/parse-product-filters';
import { parseSortParam } from '@/lib/product-listing/sort/parse/parse-sort-param';
import { isDefined } from '@/utils/type-guards/is-defined';
import { DEFAULT_PRODUCT_SORT } from '@/lib/product-listing/sort/consts';

export function parseProductListing(
    searchParams: ProductSearchParams = {},
): ParsedProductListing {
    const filters = parseProductFilters(searchParams);
    const sort = parseSortParam(searchParams.sort);

    const collectedIssues = [...filters.issues, sort.issue];

    const issues = [...new Set(collectedIssues)].filter(isDefined);

    return {
        filters: filters.value,
        sort: sort.value ?? DEFAULT_PRODUCT_SORT,
        issues,
    };
}

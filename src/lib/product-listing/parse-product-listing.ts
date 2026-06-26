import type {
    ProductListingIssue,
    ProductSearchParams,
} from '@/lib/product-listing/types';
import { parseProductFilters } from '@/lib/product-listing/filters/parse/parse-product-filters';
import type { ProductFilters } from '@/lib/product-listing/filters/types';
import type { ProductSort } from '@/lib/product-listing/sort/types';
import { parseSortParam } from '@/lib/product-listing/sort/parse/parse-sort-param';
import { isDefined } from '@/utils/type-guards/is-defined';

export interface ParsedProductListing {
    filters: ProductFilters;
    sort: ProductSort;
    issues: ProductListingIssue[];
}

export function parseProductListing(
    searchParams: ProductSearchParams = {},
): ParsedProductListing {
    const filters = parseProductFilters(searchParams);
    const sort = parseSortParam(searchParams.sort);

    const collectedIssues = [...filters.issues, sort.issue];

    const issues = [...new Set(collectedIssues)].filter(isDefined);

    return {
        filters: filters.value,
        sort: sort.value,
        issues,
    };
}

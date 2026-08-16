import { parseProductFilters } from '@/app/(shop)/(catalog)/lib/product-listing/filters/parse-product-filters';
import type {
    ParsedProductListing,
    ProductSearchParams,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { parseSortParam } from '@/app/(shop)/(catalog)/lib/product-listing/sort/parse/parse-sort-param';
import { isDefined } from '@/lib/type-guards/is-defined';
import { DEFAULT_PRODUCT_SORT } from '@/services/product/sort/sort.constants';

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

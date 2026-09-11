import { normalizeQueryParam } from '@/app/(shop)/(catalog)/lib/product-listing/filters/normalize/normalize-query-param';
import { parseProductFilters } from '@/app/(shop)/(catalog)/lib/product-listing/filters/parse-product-filters';
import type {
    ParsedProductListing,
    ProductListingOptions,
    ProductSearchParams,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { parseSortParam } from '@/app/(shop)/(catalog)/lib/product-listing/sort/parse/parse-sort-param';
import { SEARCH_QUERY_PARAM } from '@/lib/search/search.constants';
import { isDefined } from '@/lib/type-guards/is-defined';
import { DEFAULT_PRODUCT_SORT } from '@/services/product/sort/sort.constants';

export function parseProductListing(
    searchParams: ProductSearchParams = {},
    options: ProductListingOptions = {},
): ParsedProductListing {
    const query = normalizeQueryParam(searchParams[SEARCH_QUERY_PARAM]);
    const filters = parseProductFilters(
        searchParams,
        options.defaultFilterOverrides,
    );
    const sort = parseSortParam(searchParams.sort);

    const collectedIssues = [...filters.issues, sort.issue];

    const issues = [...new Set(collectedIssues)].filter(isDefined);

    return {
        query,
        filters: filters.value,
        sort: sort.value ?? DEFAULT_PRODUCT_SORT,
        issues,
    };
}

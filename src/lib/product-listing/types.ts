import { SEARCH_QUERY_PARAM } from '@/lib/search/consts';
import { PRODUCT_SORT_PARAM } from '@/lib/product-listing/sort/consts';
import { PRODUCT_FILTER_PARAMS } from '@/lib/product-listing/filters/consts';
import type { PaginationSearchParams } from '@/lib/pagination/types';
import type {
    ProductSort,
    ProductSortListingIssue,
} from '@/lib/product-listing/sort/types';
import type {
    ProductFilterListingIssue,
    ProductFilters,
} from '@/lib/product-listing/filters/types';

export type ProductSearchParams = {
    [SEARCH_QUERY_PARAM]?: string;
    [PRODUCT_SORT_PARAM]?: string;
    [PRODUCT_FILTER_PARAMS.SALE]?: string;
    [PRODUCT_FILTER_PARAMS.DISCOUNT]?: string;
    [PRODUCT_FILTER_PARAMS.PRICE_FROM]?: string;
    [PRODUCT_FILTER_PARAMS.PRICE_TO]?: string;
    [PRODUCT_FILTER_PARAMS.IN_STOCK]?: string;
};

export type ProductListingSearchParams = PaginationSearchParams &
    ProductSearchParams;

export type ProductListingIssue =
    | ProductSortListingIssue
    | ProductFilterListingIssue;

export type ParsedProductListing = {
    filters: ProductFilters;
    sort: ProductSort;
    issues: ProductListingIssue[];
};

export type ProductListingUpdates = {
    filters?: Partial<ProductFilters>;
    sort?: ProductSort;
};

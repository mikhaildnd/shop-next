import type {
    DISCOUNT_FILTER_VALUES,
    PRODUCT_FILTER_LISTING_ISSUES,
    PRODUCT_FILTER_PARAMS,
    PRODUCT_SORT_LISTING_ISSUES,
    PRODUCT_SORT_PARAM,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { PaginationSearchParams } from '@/lib/pagination/pagination.types';
import type { SEARCH_QUERY_PARAM } from '@/lib/search/search.constants';
import type { ProductFilters } from '@/services/product/filters/filter.types';
import type { ProductSort } from '@/services/product/sort/sort.types';

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

export type ProductFilterListingIssue =
    (typeof PRODUCT_FILTER_LISTING_ISSUES)[keyof typeof PRODUCT_FILTER_LISTING_ISSUES];

export type ProductFilterParseResult<T> = {
    value: T;
    issue?: ProductFilterListingIssue;
};

export type ProductSortListingIssue =
    (typeof PRODUCT_SORT_LISTING_ISSUES)[keyof typeof PRODUCT_SORT_LISTING_ISSUES];

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

export type DiscountFilterValue = (typeof DISCOUNT_FILTER_VALUES)[number];

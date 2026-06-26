import { SEARCH_QUERY_PARAM } from '@/lib/search/consts';
import { PRODUCT_SORT_PARAM } from '@/lib/product-listing/sort/consts';
import { PRODUCT_FILTER_PARAMS } from '@/lib/product-listing/filters/consts';
import type { PaginationSearchParams } from '@/lib/pagination/types';
import { ProductSortListingIssue } from '@/lib/product-listing/sort/types';
import type { ProductFilterListingIssue } from '@/lib/product-listing/filters/types';

export type ProductSearchParams = {
    [SEARCH_QUERY_PARAM]?: string;
    [PRODUCT_SORT_PARAM]?: string;
    [PRODUCT_FILTER_PARAMS.sale]?: string;
    [PRODUCT_FILTER_PARAMS.discount]?: string;
    [PRODUCT_FILTER_PARAMS.priceFrom]?: string;
    [PRODUCT_FILTER_PARAMS.priceTo]?: string;
    [PRODUCT_FILTER_PARAMS.inStock]?: string;
};

export type ProductListingSearchParams = PaginationSearchParams &
    ProductSearchParams;

export type ProductListingIssue =
    | ProductSortListingIssue
    | ProductFilterListingIssue;

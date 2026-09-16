import { appendProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/append-product-listing-search-params';
import { PRODUCTS_PER_PAGE } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductListingState } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { appendPaginationSearchParams } from '@/lib/pagination/append-pagination-search-params';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { getPaginationSearchParams } from '@/lib/pagination/get-pagination-search-params';
import { PAGINATION_VIEWS } from '@/lib/pagination/pagination.constants';
import type { PaginationParams } from '@/lib/pagination/pagination.types';
import { buildSearchParams } from '@/lib/url/build-search-params';
import type { ProductFilters } from '@/services/product/filters/filter.types';

function resetPagination(pagination: PaginationParams): PaginationParams {
    return {
        ...pagination,
        currentPage: 1,
        startPage: 1,
        view: PAGINATION_VIEWS.SINGLE,
    };
}

interface BuildProductListingUrlOptions {
    pathname: string;
    searchParams: URLSearchParams;
    listing: ProductListingState;
    defaultFilters: ProductFilters;
}

export function buildProductListingUrl({
    pathname,
    searchParams,
    listing,
    defaultFilters,
}: BuildProductListingUrlOptions): string {
    const pagination = getPaginationParams({
        searchParams: getPaginationSearchParams(searchParams),
        limit: PRODUCTS_PER_PAGE,
    });

    const nextPagination = resetPagination(pagination);

    const params = new URLSearchParams(searchParams);

    appendProductListingSearchParams({
        params,
        listing,
        defaultFilters,
    });

    appendPaginationSearchParams({
        params,
        pagination: nextPagination,
    });

    return `${pathname}${buildSearchParams(params)}`;
}

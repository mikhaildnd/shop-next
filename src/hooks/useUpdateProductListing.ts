'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { appendPaginationSearchParams } from '@/lib/pagination/append-pagination-search-params';
import { PAGINATION_VIEWS } from '@/lib/pagination/consts';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { getPaginationSearchParams } from '@/lib/pagination/get-pagination-search-params';
import type { PaginationParams } from '@/lib/pagination/types';
import { appendProductListingSearchParams } from '@/lib/product-listing/append-product-listing-search-params';
import { applyProductListingUpdates } from '@/lib/product-listing/apply-product-listing-updates';
import { PRODUCTS_PER_PAGE } from '@/lib/product-listing/consts';
import { getProductSearchParams } from '@/lib/product-listing/get-product-search-params';
import { parseProductListing } from '@/lib/product-listing/parse-product-listing';
import type { ProductListingUpdates } from '@/lib/product-listing/types';
import { buildSearchParams } from '@/lib/url/build-search-params';

function resetPagination(pagination: PaginationParams): PaginationParams {
    return {
        ...pagination,
        currentPage: 1,
        startPage: 1,
        view: PAGINATION_VIEWS.SINGLE,
    };
}

export function useUpdateProductListing() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return useCallback(
        (updates: ProductListingUpdates) => {
            const listing = parseProductListing(
                getProductSearchParams(searchParams),
            );

            const pagination = getPaginationParams({
                searchParams: getPaginationSearchParams(searchParams),
                limit: PRODUCTS_PER_PAGE,
            });

            const nextListing = applyProductListingUpdates(listing, updates);

            const nextPagination = resetPagination(pagination);

            const params = new URLSearchParams(searchParams);

            appendProductListingSearchParams({
                params,
                listing: nextListing,
            });

            appendPaginationSearchParams({
                params,
                pagination: nextPagination,
            });

            const nextUrl = `${pathname}${buildSearchParams(params)}`;

            router.replace(nextUrl, {
                scroll: false,
            });
        },
        [pathname, router, searchParams],
    );
}

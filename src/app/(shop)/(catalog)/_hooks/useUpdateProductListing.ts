'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { appendProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/append-product-listing-search-params';
import { applyProductListingUpdates } from '@/app/(shop)/(catalog)/lib/product-listing/apply-product-listing-updates';
import { getProductSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/get-product-search-params';
import { parseProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/parse-product-listing';
import { PRODUCTS_PER_PAGE } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductListingUpdates } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { appendPaginationSearchParams } from '@/lib/pagination/append-pagination-search-params';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { getPaginationSearchParams } from '@/lib/pagination/get-pagination-search-params';
import { PAGINATION_VIEWS } from '@/lib/pagination/pagination.constants';
import type { PaginationParams } from '@/lib/pagination/pagination.types';
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

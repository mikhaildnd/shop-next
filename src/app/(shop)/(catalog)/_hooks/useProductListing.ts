'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { appendProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/append-product-listing-search-params';
import { applyProductListingUpdates } from '@/app/(shop)/(catalog)/lib/product-listing/apply-product-listing-updates';
import { getProductFilterDefaults } from '@/app/(shop)/(catalog)/lib/product-listing/get-product-filter-defaults';
import { getProductSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/get-product-search-params';
import { parseProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/parse-product-listing';
import { PRODUCTS_PER_PAGE } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type {
    ProductListingOptions,
    ProductListingUpdates,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { appendPaginationSearchParams } from '@/lib/pagination/append-pagination-search-params';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { getPaginationSearchParams } from '@/lib/pagination/get-pagination-search-params';
import { PAGINATION_VIEWS } from '@/lib/pagination/pagination.constants';
import type { PaginationParams } from '@/lib/pagination/pagination.types';
import { buildSearchParams } from '@/lib/url/build-search-params';
import { DEFAULT_PRODUCT_SORT } from '@/services/product/sort/sort.constants';

function resetPagination(pagination: PaginationParams): PaginationParams {
    return {
        ...pagination,
        currentPage: 1,
        startPage: 1,
        view: PAGINATION_VIEWS.SINGLE,
    };
}

export function useProductListing(options: ProductListingOptions = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { defaultFilterOverrides } = options;
    const defaults = getProductFilterDefaults(defaultFilterOverrides);

    const listing = parseProductListing(getProductSearchParams(searchParams), {
        defaultFilterOverrides,
    });

    const updateListing = useCallback(
        (updates: ProductListingUpdates) => {
            const currentListing = parseProductListing(
                getProductSearchParams(searchParams),
                { defaultFilterOverrides },
            );

            const pagination = getPaginationParams({
                searchParams: getPaginationSearchParams(searchParams),
                limit: PRODUCTS_PER_PAGE,
            });

            const nextListing = applyProductListingUpdates(
                currentListing,
                updates,
            );

            const nextPagination = resetPagination(pagination);

            const params = new URLSearchParams(searchParams);

            appendProductListingSearchParams({
                params,
                listing: nextListing,
                defaultFilterOverrides,
            });

            appendPaginationSearchParams({
                params,
                pagination: nextPagination,
            });

            const nextUrl = `${pathname}${buildSearchParams(params)}`;

            router.replace(nextUrl, { scroll: false });
        },
        [defaultFilterOverrides, pathname, router, searchParams],
    );

    const resetFilters = useCallback(() => {
        updateListing({
            filters: defaults,
        });
    }, [defaults, updateListing]);

    const resetListing = useCallback(() => {
        updateListing({
            filters: defaults,
            sort: DEFAULT_PRODUCT_SORT,
        });
    }, [defaults, updateListing]);

    return { ...listing, updateListing, resetFilters, resetListing };
}

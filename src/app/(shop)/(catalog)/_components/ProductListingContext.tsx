'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, type ReactNode, useCallback, useContext } from 'react';

import { applyProductListingUpdates } from '@/app/(shop)/(catalog)/lib/product-listing/apply-product-listing-updates';
import { buildProductListingUrl } from '@/app/(shop)/(catalog)/lib/product-listing/build-product-listing-url';
import { getProductSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/get-product-search-params';
import { parseProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/parse-product-listing';
import type {
    ProductListingState,
    ProductListingUpdates,
} from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import type { ProductFilters } from '@/services/product/filters/filter.types';
import type { ProductListingStats } from '@/services/product/product.types';
import { DEFAULT_PRODUCT_SORT } from '@/services/product/sort/sort.constants';

interface ProductListingProviderProps {
    children: ReactNode;
    defaultFilters: ProductFilters;
    listingStats: ProductListingStats;
}

interface ProductListingContextValue {
    listing: ProductListingState;
    listingStats: ProductListingStats;
    updateListing: (updates: ProductListingUpdates) => void;
    resetFilters: () => void;
    resetListing: () => void;
}

const ProductListingContext = createContext<ProductListingContextValue | null>(
    null,
);

export function ProductListingProvider({
    children,
    listingStats,
    defaultFilters,
}: ProductListingProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const listing = parseProductListing(getProductSearchParams(searchParams), {
        filterDefaults: defaultFilters,
    });

    const updateListing = useCallback(
        (updates: ProductListingUpdates) => {
            const nextListing = applyProductListingUpdates(listing, updates);

            const nextUrl = buildProductListingUrl({
                pathname,
                searchParams: new URLSearchParams(searchParams),
                listing: nextListing,
                defaultFilters,
            });

            router.replace(nextUrl, { scroll: false });
        },
        [defaultFilters, listing, pathname, router, searchParams],
    );

    const resetFilters = useCallback(() => {
        updateListing({
            filters: defaultFilters,
        });
    }, [defaultFilters, updateListing]);

    const resetListing = useCallback(() => {
        updateListing({
            filters: defaultFilters,
            sort: DEFAULT_PRODUCT_SORT,
        });
    }, [defaultFilters, updateListing]);

    return (
        <ProductListingContext.Provider
            value={{
                listing,
                listingStats,
                updateListing,
                resetFilters,
                resetListing,
            }}
        >
            {children}
        </ProductListingContext.Provider>
    );
}

export function useProductListingContext() {
    const context = useContext(ProductListingContext);

    if (!context) {
        throw new Error(
            'useProductListingContext must be used within ProductListingProvider',
        );
    }

    return context;
}

'use client';

import { useEffect, useEffectEvent, useState } from 'react';

import { EmptyProductState } from '@/app/(shop)/(catalog)/_components/page-states/EmptyProductState';
import { ProductListing } from '@/app/(shop)/(catalog)/_components/ProductListing';
import { ProductListingSkeleton } from '@/app/(shop)/(catalog)/_components/ProductListingSkeleton';
import { getFavoriteProducts } from '@/app/(shop)/(catalog)/favorites/actions';
import { PRODUCTS_PER_PAGE } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ParsedProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { useFavoritesContext } from '@/components/favorite/FavoritesContext';
import type { PaginationParams } from '@/lib/pagination/pagination.types';

interface FavoritesListingProps {
    listing: ParsedProductListing;
    pagination: PaginationParams;
}

type FavoritesResult = Awaited<ReturnType<typeof getFavoriteProducts>>;

export function FavoritesListing({
    listing,
    pagination,
}: FavoritesListingProps) {
    const { favoriteIds, isHydrated } = useFavoritesContext();

    const [result, setResult] = useState<FavoritesResult | null>();

    const loadFavorites = useEffectEvent(async () => {
        if (favoriteIds.size === 0) {
            return null;
        }

        return getFavoriteProducts({
            favoriteIds: [...favoriteIds],
            listing,
            pagination,
        });
    });

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        let cancelled = false;

        async function load() {
            const nextResult = await loadFavorites();

            if (!cancelled) {
                setResult(nextResult);
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [listing, pagination, isHydrated]);

    if (!isHydrated || result === undefined) {
        return <ProductListingSkeleton sort={listing.sort} />;
    }

    if (result === null || result.totalProductsCount === 0) {
        return (
            <EmptyProductState description="Добавьте товары в избранное, чтобы они появились здесь" />
        );
    }

    const totalPages = Math.ceil(result.totalProductsCount / PRODUCTS_PER_PAGE);

    return (
        <ProductListing
            sort={result.sort}
            listingStats={result.listingStats}
            products={result.products}
            currentPage={result.currentPage}
            totalPages={totalPages}
            startPage={result.startPage}
        />
    );
}

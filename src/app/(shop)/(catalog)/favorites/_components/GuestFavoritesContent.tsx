'use client';

import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';

import { ProductListing } from '@/app/(shop)/(catalog)/_components/ProductListing';
import { ProductListingProvider } from '@/app/(shop)/(catalog)/_components/ProductListingContext';
import { ProductListingSkeleton } from '@/app/(shop)/(catalog)/_components/ProductListingSkeleton';
import { getFavoriteProductsByIdsAction } from '@/app/(shop)/(catalog)/favorites/actions';
import { FAVORITES_FILTER_DEFAULTS } from '@/app/(shop)/(catalog)/favorites/favorites.constants';
import { getProductFilterDefaults } from '@/app/(shop)/(catalog)/lib/product-listing/get-product-filter-defaults';
import { parseProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/parse-product-listing';
import { PRODUCTS_PER_PAGE } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { ButtonLink } from '@/components/button/ButtonLink';
import { useFavoritesContext } from '@/components/favorite/FavoritesContext';
import { PageMessage } from '@/components/PageMessage';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { routes } from '@/routes';

interface GuestFavoritesContentProps {
    params: ProductListingSearchParams;
}

type FavoritesResult = Awaited<
    ReturnType<typeof getFavoriteProductsByIdsAction>
>;

export function GuestFavoritesContent({ params }: GuestFavoritesContentProps) {
    const { favoriteIds } = useFavoritesContext();

    const [result, setResult] = useState<FavoritesResult | null>();

    const hasLoadedInitialFavorites = useRef(false);

    const listing = useMemo(
        () =>
            parseProductListing(params, {
                filterDefaults: FAVORITES_FILTER_DEFAULTS,
            }),
        [params],
    );

    const pagination = useMemo(
        () =>
            getPaginationParams({
                searchParams: params,
                limit: PRODUCTS_PER_PAGE,
            }),
        [params],
    );

    const loadFavorites = useEffectEvent(async () => {
        if (favoriteIds.size === 0) {
            return null;
        }

        return getFavoriteProductsByIdsAction({
            favoriteIds: [...favoriteIds],
            listing,
            pagination,
        });
    });

    useEffect(() => {
        if (hasLoadedInitialFavorites.current) {
            return;
        }

        let cancelled = false;

        async function load() {
            const nextResult = await loadFavorites();

            if (cancelled) {
                return;
            }

            setResult(nextResult);
            hasLoadedInitialFavorites.current = true;
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [favoriteIds]);

    useEffect(() => {
        if (!hasLoadedInitialFavorites.current) {
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
    }, [listing, pagination]);

    if (result === undefined) {
        return <ProductListingSkeleton />;
    }

    if (result === null || result.totalProductsCount === 0) {
        return (
            <PageMessage
                title="В избранном пока ничего нет"
                description="Добавляйте понравившиеся товары, чтобы быстро найти их позже"
            >
                <ButtonLink href={routes.catalogPage()}>В каталог</ButtonLink>
            </PageMessage>
        );
    }

    const totalPages = Math.ceil(result.totalProductsCount / PRODUCTS_PER_PAGE);

    const defaultFilters = getProductFilterDefaults(FAVORITES_FILTER_DEFAULTS);

    return (
        <ProductListingProvider
            listingStats={result.listingStats}
            defaultFilters={defaultFilters}
        >
            <ProductListing
                products={result.products}
                currentPage={result.currentPage}
                totalPages={totalPages}
                startPage={result.startPage}
            />
        </ProductListingProvider>
    );
}

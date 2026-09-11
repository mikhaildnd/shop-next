'use server';

import type { ProductListingState } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { requireSession } from '@/auth/session';
import type { PaginationParams } from '@/lib/pagination/pagination.types';
import {
    addFavorite,
    mergeFavorites,
    removeFavorite,
} from '@/services/favorite/favorite.service';
import {
    getProductListingStats,
    getProducts,
} from '@/services/product/product.service';

interface GetFavoriteProductsByIdsActionParams {
    favoriteIds: string[];
    listing: ProductListingState;
    pagination: PaginationParams;
}

export async function getFavoriteProductsByIdsAction({
    favoriteIds,
    listing,
    pagination,
}: GetFavoriteProductsByIdsActionParams) {
    const selection = {
        query: listing.query,
        filters: listing.filters,
        selectionScope: {
            id: {
                in: favoriteIds,
            },
        },
    };

    const [productsResult, listingStats] = await Promise.all([
        getProducts({
            ...selection,
            take: pagination.take,
            skip: pagination.skip,
            sort: listing.sort,
        }),
        getProductListingStats(selection),
    ]);

    return {
        ...productsResult,
        listingStats,
        sort: listing.sort,
        currentPage: pagination.currentPage,
        startPage: pagination.startPage,
    };
}

export async function mergeFavoritesAction(favoriteIds: string[]) {
    const session = await requireSession();

    return mergeFavorites(session.user.id, favoriteIds);
}

export async function addFavoriteAction(productId: string) {
    const session = await requireSession();

    await addFavorite(session.user.id, productId);
}

export async function removeFavoriteAction(productId: string) {
    const session = await requireSession();

    await removeFavorite(session.user.id, productId);
}

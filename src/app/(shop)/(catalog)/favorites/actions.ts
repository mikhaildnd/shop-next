'use server';

import type { ParsedProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { requireSession } from '@/auth/session';
import type { PaginationParams } from '@/lib/pagination/pagination.types';
import {
    addFavorite,
    mergeFavorites,
    removeFavorite,
} from '@/services/favorite/favorite.service';
import { getProducts } from '@/services/product/product.service';

interface GetFavoriteProductsByIdsActionParams {
    favoriteIds: string[];
    listing: ParsedProductListing;
    pagination: PaginationParams;
}

export async function getFavoriteProductsByIdsAction({
    favoriteIds,
    listing,
    pagination,
}: GetFavoriteProductsByIdsActionParams) {
    const result = await getProducts({
        ...listing,
        take: pagination.take,
        skip: pagination.skip,
        selectionScope: {
            id: {
                in: favoriteIds,
            },
        },
    });

    return {
        ...result,
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

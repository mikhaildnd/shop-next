'use server';

import { requireSession } from '@/auth/session';
import {
    addFavorite,
    getFavoriteProductsByIds,
    mergeFavorites,
    removeFavorite,
} from '@/services/favorite/favorite.service';
import type { GetFavoriteProductsByIdsParams } from '@/services/favorite/favorite.types';

export async function getFavoriteProductsByIdsAction(
    params: GetFavoriteProductsByIdsParams,
) {
    return getFavoriteProductsByIds(params);
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

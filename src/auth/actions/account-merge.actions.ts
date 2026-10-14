'use server';

import { headers } from 'next/headers';

import type { RetryAccountMergeActionResult } from '@/auth/account-merge.types';
import { auth } from '@/auth/auth';
import { requireAuthenticatedUser } from '@/auth/session';
import { getReconciledCart } from '@/services/cart/cart.service';
import { getFavoriteIds } from '@/services/favorite/favorite.service';

export async function getPendingAccountMerge(): Promise<boolean> {
    const result = await auth.api.getPendingAccountMerge({
        headers: await headers(),
    });

    return result.hasPendingMerge;
}

export async function retryAccountMerge(): Promise<RetryAccountMergeActionResult> {
    const user = await requireAuthenticatedUser();

    const mergeResult = await auth.api.retryAccountMerge({
        headers: await headers(),
    });

    if (mergeResult.status !== 'success') {
        return {
            status: mergeResult.status,
            cart: null,
            cartError: false,
            favoriteIds: null,
            favoritesError: false,
        };
    }

    const [cartResult, favoritesResult] = await Promise.all([
        getReconciledCart(user.id)
            .then((cart) => ({
                cart,
                cartError: false,
            }))
            .catch((error: unknown) => {
                console.error('Failed to load cart after account merge', {
                    userId: user.id,
                    error,
                });

                return {
                    cart: null,
                    cartError: true,
                };
            }),
        getFavoriteIds(user.id)
            .then((favoriteIds) => ({
                favoriteIds,
                favoritesError: false,
            }))
            .catch((error: unknown) => {
                console.error('Failed to load favorites after account merge', {
                    userId: user.id,
                    error,
                });

                return {
                    favoriteIds: null,
                    favoritesError: true,
                };
            }),
    ]);

    return {
        status: 'success',
        ...cartResult,
        ...favoritesResult,
    };
}

export async function cancelAccountMerge() {
    return auth.api.cancelAccountMerge({
        headers: await headers(),
    });
}

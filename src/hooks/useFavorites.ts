'use client';

import { useEffect } from 'react';

import { mergeFavoritesAction } from '@/app/(shop)/(catalog)/favorites/actions';
import { useLocalFavorites } from '@/hooks/useLocalFavorites';
import { useServerFavorites } from '@/hooks/useServerFavorites';

interface UseFavoritesOptions {
    isAuthenticated: boolean;
    initialFavoriteIds: string[];
    initialFavoriteCount: number;
}

interface UseFavoritesReturn {
    favoriteCount: number;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (productId: string) => void;
}

export function useFavorites({
    isAuthenticated,
    initialFavoriteIds,
    initialFavoriteCount,
}: UseFavoritesOptions): UseFavoritesReturn {
    const localFavorites = useLocalFavorites();

    const serverFavorites = useServerFavorites({
        initialFavoriteIds,
        initialFavoriteCount,
    });

    const {
        favoriteIds: localFavoriteIds,
        isHydrated: isLocalHydrated,
        clearFavorites,
        isFavorite: isLocalFavorite,
        toggleFavorite: toggleLocalFavorite,
    } = localFavorites;

    const {
        favoriteCount: serverFavoriteCount,
        isFavorite: isServerFavorite,
        toggleFavorite: toggleServerFavorite,
        syncFavoriteCount,
    } = serverFavorites;

    useEffect(() => {
        if (!isAuthenticated || !isLocalHydrated) {
            return;
        }

        if (localFavoriteIds.size === 0) {
            return;
        }

        async function mergeFavorites() {
            try {
                const favoriteCount = await mergeFavoritesAction([
                    ...localFavoriteIds,
                ]);

                syncFavoriteCount(favoriteCount);
                clearFavorites();
            } catch {
                // Keep local favorites when the merge fails.
            }
        }

        void mergeFavorites();
    }, [
        isAuthenticated,
        isLocalHydrated,
        localFavoriteIds,
        syncFavoriteCount,
        clearFavorites,
    ]);

    if (isAuthenticated) {
        return {
            favoriteCount: serverFavoriteCount,
            isFavorite: isServerFavorite,
            toggleFavorite: toggleServerFavorite,
        };
    }

    return {
        favoriteCount: isLocalHydrated ? localFavoriteIds.size : 0,
        isFavorite: (productId) => isLocalFavorite(productId),
        toggleFavorite: (productId) => toggleLocalFavorite(productId),
    };
}

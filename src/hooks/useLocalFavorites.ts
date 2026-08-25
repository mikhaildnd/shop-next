'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

import {
    addFavorite,
    clearFavorites,
    getFavoriteIds,
    getServerFavoriteIds,
    removeFavorite,
    subscribeToFavorites,
} from '@/lib/favorite/favorite-storage';

interface UseLocalFavoritesReturn {
    isHydrated: boolean;
    favoriteIds: Set<string>;
    isFavorite: (productId: string) => boolean;
    addFavorite: (productId: string) => void;
    removeFavorite: (productId: string) => void;
    toggleFavorite: (productId: string) => void;
    clearFavorites: () => void;
}

export function useLocalFavorites(): UseLocalFavoritesReturn {
    const favoriteIds = useSyncExternalStore(
        subscribeToFavorites,
        getFavoriteIds,
        getServerFavoriteIds,
    );

    const isHydrated = useSyncExternalStore(
        subscribeToFavorites,
        () => true,
        () => false,
    );

    const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

    const isFavorite = useCallback(
        (productId: string) => favoriteIdSet.has(productId),
        [favoriteIdSet],
    );

    const toggleFavorite = useCallback(
        (productId: string) => {
            if (favoriteIdSet.has(productId)) {
                removeFavorite(productId);
            } else {
                addFavorite(productId);
            }
        },
        [favoriteIdSet, addFavorite, removeFavorite],
    );

    return {
        isHydrated,
        favoriteIds: favoriteIdSet,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearFavorites,
    };
}

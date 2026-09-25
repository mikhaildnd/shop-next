'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

import {
    addFavorite as addFavoriteToStorage,
    clearFavorites as clearFavoritesStorage,
    getFavoriteIds,
    getServerFavoriteIds,
    removeFavorite as removeFavoriteFromStorage,
    subscribeToFavorites,
} from '@/lib/favorite/favorite-storage';

interface UseLocalFavoritesResult {
    favoriteIds: Set<string>;
    isFavorite: (productId: string) => boolean;
    addFavorite: (productId: string) => void;
    removeFavorite: (productId: string) => void;
    toggleFavorite: (productId: string) => void;
    clearFavorites: () => void;
}

export function useLocalFavorites(): UseLocalFavoritesResult {
    const favoriteIds = useSyncExternalStore(
        subscribeToFavorites,
        getFavoriteIds,
        getServerFavoriteIds,
    );

    const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

    const isFavorite = useCallback(
        (productId: string) => favoriteIdSet.has(productId),
        [favoriteIdSet],
    );

    const addFavorite = useCallback((productId: string) => {
        addFavoriteToStorage(productId);
    }, []);

    const removeFavorite = useCallback((productId: string) => {
        removeFavoriteFromStorage(productId);
    }, []);

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

    const clearFavorites = useCallback(() => {
        clearFavoritesStorage();
    }, []);

    return {
        favoriteIds: favoriteIdSet,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearFavorites,
    };
}

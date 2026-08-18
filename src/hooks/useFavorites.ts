'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

import {
    addFavorite as addFavoriteStorage,
    getFavoriteIds,
    getServerFavoriteIds,
    removeFavorite as removeFavoriteStorage,
    subscribeToFavorites,
} from '@/lib/favorite/favorite-storage';

interface UseFavoritesReturn {
    isHydrated: boolean;
    favoriteIds: Set<string>;
    isFavorite: (productId: string) => boolean;
    addFavorite: (productId: string) => void;
    removeFavorite: (productId: string) => void;
    toggleFavorite: (productId: string) => void;
}

export function useFavorites(): UseFavoritesReturn {
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

    const addFavorite = useCallback((productId: string) => {
        addFavoriteStorage(productId);
    }, []);

    const removeFavorite = useCallback((productId: string) => {
        removeFavoriteStorage(productId);
    }, []);

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
    };
}

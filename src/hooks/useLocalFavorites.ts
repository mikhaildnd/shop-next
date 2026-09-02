'use client';

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

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
    mutationError: boolean;
}

export function useLocalFavorites(): UseLocalFavoritesResult {
    const favoriteIds = useSyncExternalStore(
        subscribeToFavorites,
        getFavoriteIds,
        getServerFavoriteIds,
    );

    const [mutationError, setMutationError] = useState(false);

    const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

    const isFavorite = useCallback(
        (productId: string) => favoriteIdSet.has(productId),
        [favoriteIdSet],
    );

    const addFavorite = useCallback((productId: string) => {
        setMutationError(false);

        try {
            addFavoriteToStorage(productId);
        } catch {
            setMutationError(true);
        }
    }, []);

    const removeFavorite = useCallback((productId: string) => {
        setMutationError(false);

        try {
            removeFavoriteFromStorage(productId);
        } catch {
            setMutationError(true);
        }
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
        setMutationError(false);

        try {
            clearFavoritesStorage();
        } catch {
            setMutationError(true);
        }
    }, []);

    return {
        favoriteIds: favoriteIdSet,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearFavorites,
        mutationError,
    };
}

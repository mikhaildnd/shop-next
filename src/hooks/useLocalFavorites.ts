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
    mutationError: Error | null;
}

export function useLocalFavorites(): UseLocalFavoritesResult {
    const favoriteIds = useSyncExternalStore(
        subscribeToFavorites,
        getFavoriteIds,
        getServerFavoriteIds,
    );

    const [mutationError, setMutationError] = useState<Error | null>(null);

    const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

    const isFavorite = useCallback(
        (productId: string) => favoriteIdSet.has(productId),
        [favoriteIdSet],
    );

    const addFavorite = useCallback((productId: string) => {
        setMutationError(null);

        try {
            addFavoriteToStorage(productId);
        } catch (error) {
            setMutationError(
                error instanceof Error ? error : new Error('Unknown error'),
            );
        }
    }, []);

    const removeFavorite = useCallback((productId: string) => {
        setMutationError(null);

        try {
            removeFavoriteFromStorage(productId);
        } catch (error) {
            setMutationError(
                error instanceof Error ? error : new Error('Unknown error'),
            );
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
        setMutationError(null);

        try {
            clearFavoritesStorage();
        } catch (error) {
            setMutationError(
                error instanceof Error ? error : new Error('Unknown error'),
            );
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

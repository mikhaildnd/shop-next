'use client';

import { useCallback, useState } from 'react';

import {
    addFavoriteAction,
    removeFavoriteAction,
} from '@/app/(shop)/(catalog)/favorites/actions';

interface UseServerFavoritesOptions {
    initialFavoriteCount: number;
}

interface UseServerFavoritesReturn {
    favoriteCount: number;
    isFavorite: (productId: string, initialIsFavorite: boolean) => boolean;
    toggleFavorite: (productId: string, initialIsFavorite: boolean) => void;
    syncFavoriteCount: (count: number) => void;
}

export function useServerFavorites({
    initialFavoriteCount,
}: UseServerFavoritesOptions): UseServerFavoritesReturn {
    const [favoriteCount, setFavoriteCount] = useState(initialFavoriteCount);
    const [favoriteStates, setFavoriteStates] = useState<
        Record<string, boolean>
    >({});
    const isFavorite = useCallback(
        (productId: string, initialIsFavorite: boolean) => {
            return favoriteStates[productId] ?? initialIsFavorite;
        },
        [favoriteStates],
    );

    const addFavorite = useCallback(
        async (productId: string, initialIsFavorite: boolean) => {
            const previousIsFavorite =
                favoriteStates[productId] ?? initialIsFavorite;

            if (previousIsFavorite) {
                return;
            }

            setFavoriteStates((current) => ({
                ...current,
                [productId]: true,
            }));

            setFavoriteCount((current) => current + 1);

            try {
                await addFavoriteAction(productId);
            } catch {
                setFavoriteStates((current) => ({
                    ...current,
                    [productId]: previousIsFavorite,
                }));

                setFavoriteCount((current) =>
                    previousIsFavorite ? current : current - 1,
                );
            }
        },
        [favoriteStates],
    );

    const removeFavorite = useCallback(
        async (productId: string, initialIsFavorite: boolean) => {
            const previousIsFavorite =
                favoriteStates[productId] ?? initialIsFavorite;

            if (!previousIsFavorite) {
                return;
            }

            setFavoriteStates((current) => ({
                ...current,
                [productId]: false,
            }));

            setFavoriteCount((current) => current - 1);

            try {
                await removeFavoriteAction(productId);
            } catch {
                setFavoriteStates((current) => ({
                    ...current,
                    [productId]: previousIsFavorite,
                }));

                setFavoriteCount((current) =>
                    previousIsFavorite ? current + 1 : current,
                );
            }
        },
        [favoriteStates],
    );

    const toggleFavorite = useCallback(
        (productId: string, initialIsFavorite: boolean) => {
            const currentIsFavorite =
                favoriteStates[productId] ?? initialIsFavorite;

            if (currentIsFavorite) {
                void removeFavorite(productId, initialIsFavorite);
                return;
            }

            void addFavorite(productId, initialIsFavorite);
        },
        [favoriteStates, addFavorite, removeFavorite],
    );

    const syncFavoriteCount = useCallback((count: number) => {
        setFavoriteCount(count);
    }, []);

    return {
        favoriteCount,
        isFavorite,
        toggleFavorite,
        syncFavoriteCount,
    };
}

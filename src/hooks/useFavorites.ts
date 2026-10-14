'use client';

import { useCallback } from 'react';

import {
    addFavoriteAction,
    removeFavoriteAction,
} from '@/app/(app)/(shop)/(catalog)/favorites/actions';
import { useOptimisticMutations } from '@/hooks/useOptimisticMutations';
import type { ActionQueue } from '@/lib/async/action-queue';

interface UseFavoritesOptions {
    initialFavoriteIds: string[];
    actionQueue: ActionQueue;
}

interface UseFavoritesReturn {
    favoriteCount: number;
    favoriteIds: Set<string>;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (productId: string) => Promise<void>;
    replaceFavorites: (favoriteIds: string[]) => void;
}

export function useFavorites({
    initialFavoriteIds,
    actionQueue,
}: UseFavoritesOptions): UseFavoritesReturn {
    const {
        data: favoriteIds,
        mutate,
        replace,
        getData,
    } = useOptimisticMutations<Set<string>>({
        initialData: new Set(initialFavoriteIds),
        actionQueue,
    });

    const replaceFavorites = useCallback(
        (favoriteIds: string[]) => {
            replace(new Set(favoriteIds));
        },
        [replace],
    );

    const toggleFavorite = useCallback(
        (productId: string): Promise<void> => {
            const nextIsFavorite = !getData().has(productId);

            return mutate({
                update: (currentFavoriteIds) => {
                    const nextFavoriteIds = new Set(currentFavoriteIds);

                    if (nextIsFavorite) {
                        nextFavoriteIds.add(productId);
                    } else {
                        nextFavoriteIds.delete(productId);
                    }

                    return nextFavoriteIds;
                },
                action: () =>
                    nextIsFavorite
                        ? addFavoriteAction(productId)
                        : removeFavoriteAction(productId),
            });
        },
        [getData, mutate],
    );

    const isFavorite = useCallback(
        (productId: string) => favoriteIds.has(productId),
        [favoriteIds],
    );

    return {
        favoriteCount: favoriteIds.size,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        replaceFavorites,
    };
}

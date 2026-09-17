'use client';

import { useCallback, useRef, useState } from 'react';

import {
    addFavoriteAction,
    removeFavoriteAction,
} from '@/app/(shop)/(catalog)/favorites/actions';
import type { ActionQueue } from '@/lib/async/action-queue';

interface UseServerFavoritesOptions {
    initialFavoriteIds: string[];
    actionQueue: ActionQueue;
}

interface UseServerFavoritesReturn {
    favoriteCount: number;
    favoriteIds: Set<string>;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (productId: string) => void;
    replaceFavorites: (favoriteIds: string[]) => void;
    mutationError: Error | null;
}

type FavoriteMutation = {
    id: number;
    productId: string;
    isFavorite: boolean;
};

type FavoriteAction = () => Promise<void>;

export function useServerFavorites({
    initialFavoriteIds,
    actionQueue,
}: UseServerFavoritesOptions): UseServerFavoritesReturn {
    const initialFavoriteIdsSet = new Set(initialFavoriteIds);
    const [favoriteIds, setFavoriteIds] = useState(initialFavoriteIdsSet);

    const favoriteIdsRef = useRef(favoriteIds);
    const confirmedFavoriteIdsRef = useRef(initialFavoriteIdsSet);
    const pendingMutationsRef = useRef<FavoriteMutation[]>([]);
    const nextMutationIdRef = useRef(0);

    const [mutationError, setMutationError] = useState<Error | null>(null);

    const updateVisibleFavoriteIds = useCallback(() => {
        const nextFavoriteIds = new Set(confirmedFavoriteIdsRef.current);

        for (const mutation of pendingMutationsRef.current) {
            if (mutation.isFavorite) {
                nextFavoriteIds.add(mutation.productId);
            } else {
                nextFavoriteIds.delete(mutation.productId);
            }
        }

        favoriteIdsRef.current = nextFavoriteIds;
        setFavoriteIds(nextFavoriteIds);
    }, []);

    const replaceFavorites = useCallback(
        (favoriteIds: string[]) => {
            confirmedFavoriteIdsRef.current = new Set(favoriteIds);
            updateVisibleFavoriteIds();
        },
        [updateVisibleFavoriteIds],
    );

    const enqueueMutation = useCallback(
        (mutation: FavoriteMutation, action: FavoriteAction): Promise<void> => {
            pendingMutationsRef.current.push(mutation);
            updateVisibleFavoriteIds();

            const execute = async () => {
                try {
                    await action();

                    if (mutation.isFavorite) {
                        confirmedFavoriteIdsRef.current = new Set(
                            confirmedFavoriteIdsRef.current,
                        );
                        confirmedFavoriteIdsRef.current.add(mutation.productId);
                    } else {
                        const nextFavoriteIds = new Set(
                            confirmedFavoriteIdsRef.current,
                        );
                        nextFavoriteIds.delete(mutation.productId);
                        confirmedFavoriteIdsRef.current = nextFavoriteIds;
                    }
                } catch (error) {
                    setMutationError(
                        error instanceof Error
                            ? error
                            : new Error('Unknown error'),
                    );
                    throw error;
                } finally {
                    pendingMutationsRef.current =
                        pendingMutationsRef.current.filter(
                            (pendingMutation) =>
                                pendingMutation.id !== mutation.id,
                        );

                    updateVisibleFavoriteIds();
                }
            };

            return actionQueue.enqueue(execute);
        },
        [actionQueue, updateVisibleFavoriteIds],
    );

    const toggleFavorite = useCallback(
        (productId: string) => {
            const currentIsFavorite = favoriteIdsRef.current.has(productId);
            const nextIsFavorite = !currentIsFavorite;

            setMutationError(null);

            void enqueueMutation(
                {
                    id: nextMutationIdRef.current++,
                    productId,
                    isFavorite: nextIsFavorite,
                },
                () =>
                    nextIsFavorite
                        ? addFavoriteAction(productId)
                        : removeFavoriteAction(productId),
            );
        },
        [enqueueMutation],
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
        mutationError,
    };
}

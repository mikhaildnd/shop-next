'use client';

import { useCallback, useRef, useState } from 'react';

import {
    addFavoriteAction,
    removeFavoriteAction,
} from '@/app/(shop)/(catalog)/favorites/actions';
import type { ActionQueue } from '@/lib/async/action-queue';

interface UseServerFavoritesOptions {
    initialFavoriteIds: string[];
    initialFavoriteCount: number;
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
    initialFavoriteCount,
    actionQueue,
}: UseServerFavoritesOptions): UseServerFavoritesReturn {
    const [favoriteCount, setFavoriteCount] = useState(initialFavoriteCount);

    const initialFavoriteStates = Object.fromEntries(
        initialFavoriteIds.map((productId) => [productId, true]),
    );

    const [favoriteStates, setFavoriteStates] =
        useState<Record<string, boolean>>(initialFavoriteStates);

    const favoriteStatesRef = useRef(favoriteStates);
    const confirmedFavoriteStatesRef = useRef(initialFavoriteStates);
    const pendingMutationsRef = useRef<FavoriteMutation[]>([]);
    const nextMutationIdRef = useRef(0);

    const [mutationError, setMutationError] = useState<Error | null>(null);

    const updateVisibleFavoriteStates = useCallback(() => {
        const nextFavoriteStates = pendingMutationsRef.current.reduce(
            (states, mutation) => ({
                ...states,
                [mutation.productId]: mutation.isFavorite,
            }),
            confirmedFavoriteStatesRef.current,
        );

        favoriteStatesRef.current = nextFavoriteStates;
        setFavoriteStates(nextFavoriteStates);
        setFavoriteCount(
            Object.values(nextFavoriteStates).filter(Boolean).length,
        );
    }, []);

    const replaceFavorites = useCallback(
        (favoriteIds: string[]) => {
            confirmedFavoriteStatesRef.current = Object.fromEntries(
                favoriteIds.map((productId) => [productId, true]),
            );

            updateVisibleFavoriteStates();
        },
        [updateVisibleFavoriteStates],
    );

    const enqueueMutation = useCallback(
        (mutation: FavoriteMutation, action: FavoriteAction): Promise<void> => {
            pendingMutationsRef.current.push(mutation);
            updateVisibleFavoriteStates();

            const execute = async () => {
                try {
                    await action();

                    confirmedFavoriteStatesRef.current = {
                        ...confirmedFavoriteStatesRef.current,
                        [mutation.productId]: mutation.isFavorite,
                    };
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

                    updateVisibleFavoriteStates();
                }
            };

            return actionQueue.enqueue(execute);
        },
        [actionQueue, updateVisibleFavoriteStates],
    );

    const toggleFavorite = useCallback(
        (productId: string) => {
            const currentIsFavorite =
                favoriteStatesRef.current[productId] ?? false;
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
        (productId: string) => favoriteStates[productId] ?? false,
        [favoriteStates],
    );

    const favoriteIds = new Set(
        Object.entries(favoriteStates)
            .filter(([, isFavorite]) => isFavorite)
            .map(([productId]) => productId),
    );

    return {
        favoriteCount,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        replaceFavorites,
        mutationError,
    };
}

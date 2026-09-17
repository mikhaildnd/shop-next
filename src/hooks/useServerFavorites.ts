'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
    addFavoriteAction,
    mergeFavoritesAction,
    removeFavoriteAction,
} from '@/app/(shop)/(catalog)/favorites/actions';
import type { ActionQueue } from '@/lib/async/action-queue';
import {
    clearFavorites,
    getFavoriteIds,
} from '@/lib/favorite/favorite-storage';

interface UseServerFavoritesOptions {
    initialFavoriteIds: string[];
    initialFavoriteCount: number;
    actionQueue: ActionQueue;
}

interface UseServerFavoritesReturn {
    favoriteCount: number;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (productId: string) => void;
    mergeStatus: MergeStatus;
    retryMerge: () => void;
    mutationError: Error | null;
    mergeAttempt: number;
}

type MergeStatus = 'idle' | 'merging' | 'error';

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

    const [mergeStatus, setMergeStatus] = useState<MergeStatus>('idle');
    const [mergeAttempt, setMergeAttempt] = useState(0);

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

    const retryMerge = useCallback(() => {
        setMergeStatus('idle');
        setMergeAttempt((attempt) => attempt + 1);
    }, []);

    useEffect(() => {
        const favoriteIds = getFavoriteIds();

        if (favoriteIds.length === 0) {
            return;
        }

        let cancelled = false;

        async function merge() {
            setMergeStatus('merging');

            let mergedFavoriteCount = 0;

            try {
                await actionQueue.enqueue(async () => {
                    mergedFavoriteCount = await mergeFavoritesAction(favoriteIds);
                });

                if (cancelled) {
                    return;
                }

                const mergedFavoriteStates = Object.fromEntries(
                    favoriteIds.map((productId) => [productId, true]),
                );

                confirmedFavoriteStatesRef.current = {
                    ...confirmedFavoriteStatesRef.current,
                    ...mergedFavoriteStates,
                };

                updateVisibleFavoriteStates();
                setFavoriteCount(mergedFavoriteCount);
                clearFavorites();
                setMergeStatus('idle');
            } catch {
                if (!cancelled) {
                    setMergeStatus('error');
                }
            }
        }

        void merge();

        return () => {
            cancelled = true;
        };
    }, [actionQueue, mergeAttempt, updateVisibleFavoriteStates]);

    return {
        favoriteCount,
        isFavorite,
        toggleFavorite,
        mergeStatus,
        retryMerge,
        mutationError,
        mergeAttempt,
    };
}

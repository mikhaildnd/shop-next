'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
    addFavoriteAction,
    mergeFavoritesAction,
    removeFavoriteAction,
} from '@/app/(shop)/(catalog)/favorites/actions';
import {
    clearFavorites,
    getFavoriteIds,
} from '@/lib/favorite/favorite-storage';

interface UseServerFavoritesOptions {
    initialFavoriteIds: string[];
    initialFavoriteCount: number;
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

export function useServerFavorites({
    initialFavoriteIds,
    initialFavoriteCount,
}: UseServerFavoritesOptions): UseServerFavoritesReturn {
    const [favoriteCount, setFavoriteCount] = useState(initialFavoriteCount);

    const [favoriteStates, setFavoriteStates] = useState<
        Record<string, boolean>
    >(() =>
        Object.fromEntries(
            initialFavoriteIds.map((productId) => [productId, true]),
        ),
    );

    const pendingMutationsRef = useRef(new Set<string>());

    const [mergeStatus, setMergeStatus] = useState<MergeStatus>('idle');
    const [mergeAttempt, setMergeAttempt] = useState(0);

    const [mutationError, setMutationError] = useState<Error | null>(null);

    const isFavorite = useCallback(
        (productId: string) => favoriteStates[productId] ?? false,
        [favoriteStates],
    );

    const addFavorite = useCallback(
        async (productId: string) => {
            if (pendingMutationsRef.current.has(productId)) return;

            setMutationError(null);

            const previousIsFavorite = favoriteStates[productId] ?? false;
            if (previousIsFavorite) return;

            pendingMutationsRef.current.add(productId);

            setFavoriteStates((current) => ({
                ...current,
                [productId]: true,
            }));
            setFavoriteCount((current) => current + 1);

            try {
                await addFavoriteAction(productId);
            } catch (error) {
                setMutationError(
                    error instanceof Error ? error : new Error('Unknown error'),
                );

                setFavoriteStates((current) => ({
                    ...current,
                    [productId]: previousIsFavorite,
                }));
                setFavoriteCount((current) =>
                    previousIsFavorite ? current : current - 1,
                );
            } finally {
                pendingMutationsRef.current.delete(productId);
            }
        },
        [favoriteStates],
    );

    const removeFavorite = useCallback(
        async (productId: string) => {
            if (pendingMutationsRef.current.has(productId)) return;

            setMutationError(null);

            const previousIsFavorite = favoriteStates[productId] ?? false;
            if (!previousIsFavorite) return;

            pendingMutationsRef.current.add(productId);

            setFavoriteStates((current) => ({
                ...current,
                [productId]: false,
            }));
            setFavoriteCount((current) => current - 1);

            try {
                await removeFavoriteAction(productId);
            } catch (error) {
                setMutationError(
                    error instanceof Error ? error : new Error('Unknown error'),
                );

                setFavoriteStates((current) => ({
                    ...current,
                    [productId]: previousIsFavorite,
                }));
                setFavoriteCount((current) =>
                    previousIsFavorite ? current + 1 : current,
                );
            } finally {
                pendingMutationsRef.current.delete(productId);
            }
        },
        [favoriteStates],
    );

    const toggleFavorite = useCallback(
        (productId: string) => {
            const currentIsFavorite = favoriteStates[productId] ?? false;

            if (currentIsFavorite) {
                void removeFavorite(productId);
                return;
            }

            void addFavorite(productId);
        },
        [favoriteStates, addFavorite, removeFavorite],
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

            try {
                const favoriteCount = await mergeFavoritesAction(favoriteIds);

                if (cancelled) {
                    return;
                }

                setFavoriteStates((current) => ({
                    ...current,
                    ...Object.fromEntries(
                        favoriteIds.map((productId) => [productId, true]),
                    ),
                }));

                setFavoriteCount(favoriteCount);
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
    }, [mergeAttempt]);

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

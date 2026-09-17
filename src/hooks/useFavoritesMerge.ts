'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { mergeFavoritesAction } from '@/app/(shop)/(catalog)/favorites/actions';
import type { ActionQueue } from '@/lib/async/action-queue';
import {
    clearFavorites,
    getFavoriteIds,
} from '@/lib/favorite/favorite-storage';

interface UseFavoritesMergeOptions {
    actionQueue: ActionQueue;
    replaceFavorites: (favoriteIds: string[]) => void;
}

export interface UseFavoritesMergeResult {
    mergeStatus: MergeStatus;
    mergeAttempt: number;
    retryMerge: () => void;
}

type MergeStatus = 'idle' | 'merging' | 'error';

export function useFavoritesMerge({
    actionQueue,
    replaceFavorites,
}: UseFavoritesMergeOptions): UseFavoritesMergeResult {
    const [mergeStatus, setMergeStatus] = useState<MergeStatus>('idle');
    const [mergeAttempt, setMergeAttempt] = useState(0);
    const isMergingRef = useRef(false);

    const retryMerge = useCallback(() => {
        if (isMergingRef.current) {
            return;
        }

        setMergeStatus('idle');
        setMergeAttempt((attempt) => attempt + 1);
    }, []);

    useEffect(() => {
        if (isMergingRef.current) {
            return;
        }

        const favoriteIds = getFavoriteIds();

        if (favoriteIds.length === 0) {
            return;
        }

        const favoriteIdsToMerge = [...favoriteIds];

        isMergingRef.current = true;

        async function merge() {
            setMergeStatus('merging');

            try {
                await actionQueue.enqueue(async () => {
                    const mergedFavoriteIds = await mergeFavoritesAction(
                        favoriteIdsToMerge,
                    );

                    replaceFavorites(mergedFavoriteIds);
                    clearFavorites();
                });

                setMergeStatus('idle');
            } catch {
                setMergeStatus('error');
            } finally {
                isMergingRef.current = false;
            }
        }

        void merge();
    }, [actionQueue, mergeAttempt, replaceFavorites]);

    return {
        mergeStatus,
        mergeAttempt,
        retryMerge,
    };
}

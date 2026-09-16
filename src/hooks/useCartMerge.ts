'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { mergeCartAction } from '@/app/(shop)/cart/actions';
import type { CartEntry, MergeStatus } from '@/lib/cart/cart.types';
import {
    getCartEntries,
    removeMergedCartEntries,
} from '@/lib/cart/cart-storage';
import type { CartDto } from '@/services/cart/cart.types';

interface UseCartMergeOptions {
    enqueueAction: (action: () => Promise<void>) => Promise<void>;
    replaceCart: (cart: CartDto) => void;
}

export interface UseCartMergeResult {
    mergeStatus: MergeStatus;
    mergeAttempt: number;
    retryMerge: () => void;
}

export function useCartMerge({
    enqueueAction,
    replaceCart,
}: UseCartMergeOptions): UseCartMergeResult {
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

        const localCartEntries = getCartEntries();

        if (localCartEntries.length === 0) {
            return;
        }

        const entriesToMerge: CartEntry[] = localCartEntries.map((entry) => ({
            ...entry,
        }));

        isMergingRef.current = true;

        async function mergeCart() {
            setMergeStatus('merging');

            try {
                await enqueueAction(async () => {
                    const cart = await mergeCartAction(entriesToMerge);

                    replaceCart(cart);
                    removeMergedCartEntries(entriesToMerge);
                });

                setMergeStatus('idle');
                setMergeAttempt((attempt) => attempt + 1);
            } catch {
                setMergeStatus('error');
            } finally {
                isMergingRef.current = false;
            }
        }

        async function startMerge() {
            await Promise.resolve();
            await mergeCart();
        }

        void startMerge();
    }, [enqueueAction, mergeAttempt, replaceCart]);

    return {
        mergeStatus,
        mergeAttempt,
        retryMerge,
    };
}

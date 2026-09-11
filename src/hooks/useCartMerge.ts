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
    replaceCart: (cart: CartDto) => void;
}

export interface UseCartMergeResult {
    mergeStatus: MergeStatus;
    mergeAttempt: number;
    retryMerge: () => void;
}

export function useCartMerge({
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
                const cart = await mergeCartAction(entriesToMerge);

                replaceCart(cart);
                removeMergedCartEntries(entriesToMerge);

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
    }, [mergeAttempt, replaceCart]);

    return {
        mergeStatus,
        mergeAttempt,
        retryMerge,
    };
}

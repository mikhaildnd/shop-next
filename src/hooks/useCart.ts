'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { mergeCartAction } from '@/app/(shop)/cart/actions';
import { useLocalCart } from '@/hooks/useLocalCart';
import { useServerCart } from '@/hooks/useServerCart';
import type { CartDto } from '@/services/cart/cart.types';

type CartType = 'server' | 'local';
type MergeStatus = 'idle' | 'merging' | 'error';

interface UseCartOptions {
    isAuthenticated: boolean;
    initialCartState: CartDto;
}

export function useCart({ isAuthenticated, initialCartState }: UseCartOptions) {
    const initialCartEntries = initialCartState.items.map(
        ({ product, quantity }) => ({
            productId: product.id,
            quantity,
        }),
    );

    const localCart = useLocalCart();

    const serverCart = useServerCart({
        initialCartEntries,
    });

    const {
        cartEntries: localCartEntries,
        isHydrated: isLocalHydrated,
        removeMergedCartEntries,
    } = localCart;

    const { syncCartEntries } = serverCart;

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
        if (!isAuthenticated) {
            return;
        }

        if (!isLocalHydrated || isMergingRef.current) {
            return;
        }

        if (localCartEntries.length === 0) {
            return;
        }

        const entriesToMerge = localCartEntries.map((entry) => ({ ...entry }));

        isMergingRef.current = true;

        async function mergeCart() {
            setMergeStatus('merging');

            try {
                const cart = await mergeCartAction(entriesToMerge);

                const cartEntries = cart.items.map(({ product, quantity }) => ({
                    productId: product.id,
                    quantity,
                }));

                syncCartEntries(cartEntries);
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
    }, [
        isAuthenticated,
        isLocalHydrated,
        localCartEntries,
        syncCartEntries,
        removeMergedCartEntries,
        mergeAttempt,
    ]);

    const cartType: CartType = isAuthenticated ? 'server' : 'local';

    return {
        ...(isAuthenticated ? serverCart : localCart),
        cartType,
        mergeStatus,
        retryMerge,
    };
}

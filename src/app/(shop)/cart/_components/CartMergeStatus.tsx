'use client';

import { useEffect, useRef } from 'react';

import { toast } from '@/components/ui/toast';
import type { MergeStatus } from '@/lib/cart/cart.types';

interface CartMergeStatusProps {
    mergeStatus: MergeStatus;
    mergeAttempt: number;
    retryMerge: () => void;
}

export function CartMergeStatus({
    mergeStatus,
    retryMerge,
    mergeAttempt,
}: CartMergeStatusProps) {
    const mergeToastId = useRef<string | null>(null);

    useEffect(() => {
        if (mergeStatus === 'merging') {
            if (mergeAttempt === 0) {
                return;
            }
            if (mergeToastId.current) {
                toast.update(mergeToastId.current, {
                    description: 'Синхронизация корзины...',
                    type: 'loading',
                    timeout: 0,
                    actionProps: undefined,
                });
            } else {
                mergeToastId.current = toast.add({
                    description: 'Синхронизация корзины...',
                    type: 'loading',
                    timeout: 0,
                });
            }

            return;
        }

        if (mergeStatus === 'error') {
            if (!mergeToastId.current) {
                mergeToastId.current = toast.add({
                    description: 'Не удалось синхронизировать корзину',
                    type: 'error',
                    timeout: 0,
                    actionProps: {
                        children: 'Повторить',
                        onClick: retryMerge,
                    },
                });

                return;
            }

            toast.update(mergeToastId.current, {
                description: 'Не удалось синхронизировать корзину',
                type: 'error',
                timeout: 0,
                actionProps: {
                    children: 'Повторить',
                    onClick: retryMerge,
                },
            });

            return;
        }

        if (mergeToastId.current) {
            toast.close(mergeToastId.current);
            mergeToastId.current = null;
        }
    }, [mergeAttempt, mergeStatus, retryMerge]);

    return null;
}

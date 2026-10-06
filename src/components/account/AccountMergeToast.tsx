'use client';

import { useEffect, useRef } from 'react';

import {
    getPendingAccountMerge,
    retryAccountMerge,
} from '@/app/auth/account-merge.actions';
import { useCartContext } from '@/components/cart/CartContext';
import { toast } from '@/components/ui/toast';

const ACCOUNT_MERGE_TOAST_ID = 'account-merge';

export function AccountMergeToast() {
    const { replaceCartData } = useCartContext();
    const isRetryingRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        async function handleRetry() {
            if (isRetryingRef.current) {
                return;
            }

            isRetryingRef.current = true;

            toast.update(ACCOUNT_MERGE_TOAST_ID, {
                description: 'Синхронизируем корзину...',
                type: 'loading',
                actionProps: {
                    children: 'Повторить',
                    disabled: true,
                },
            });

            try {
                const result = await retryAccountMerge();

                if (result.cart) {
                    replaceCartData(result.cart);
                }

                toast.update(ACCOUNT_MERGE_TOAST_ID, {
                    description: 'Корзина синхронизирована',
                    timeout: 3000,
                    type: 'success',
                    actionProps: undefined,
                });
            } catch {
                toast.update(ACCOUNT_MERGE_TOAST_ID, {
                    description: 'Не удалось синхронизировать корзину',
                    type: 'error',
                    timeout: 0,
                    actionProps: {
                        children: 'Повторить',
                        onClick: () => {
                            void handleRetry();
                        },
                    },
                });
            } finally {
                isRetryingRef.current = false;
            }
        }

        async function checkPendingMerge() {
            try {
                const hasPendingMerge = await getPendingAccountMerge();

                if (cancelled) {
                    return;
                }

                if (!hasPendingMerge) {
                    toast.close(ACCOUNT_MERGE_TOAST_ID);
                    return;
                }

                toast.add({
                    id: ACCOUNT_MERGE_TOAST_ID,
                    description: 'Не удалось синхронизировать корзину',
                    type: 'error',
                    timeout: 0,
                    actionProps: {
                        children: 'Повторить',
                        onClick: () => {
                            void handleRetry();
                        },
                    },
                });
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error('Failed to check pending account merge', error);
            }
        }

        void checkPendingMerge();

        return () => {
            cancelled = true;
        };
    }, [replaceCartData]);

    return null;
}

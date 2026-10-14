'use client';

import { useEffect, useRef, useState } from 'react';

import {
    cancelAccountMerge,
    retryAccountMerge,
} from '@/auth/actions/account-merge.actions';
import { useCartContext } from '@/components/cart/CartContext';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/toast';

const ACCOUNT_MERGE_TOAST_ID = 'account-merge';

export function AccountMergeToast() {
    const { replaceCartData } = useCartContext();
    const isRetryingRef = useRef(false);
    const isCancellingRef = useRef(false);

    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

    async function handleCancel() {
        if (isCancellingRef.current) {
            return;
        }

        isCancellingRef.current = true;
        setIsCancelDialogOpen(false);

        toast.update(ACCOUNT_MERGE_TOAST_ID, {
            title: 'Отменяем перенос...',
            description: undefined,
            type: 'loading',
            actionProps: undefined,
            data: undefined,
        });

        try {
            const result = await cancelAccountMerge();

            if (result.status === 'success') {
                toast.close(ACCOUNT_MERGE_TOAST_ID);
                return;
            }

            if (result.status === 'failed') {
                toast.update(ACCOUNT_MERGE_TOAST_ID, {
                    title: 'Не удалось отменить перенос',
                    description: 'Попробуйте ещё раз',
                    type: 'error',
                    timeout: 0,
                    actionProps: {
                        children: 'Повторить отмену',
                        onClick: () => {
                            void handleCancel();
                        },
                    },
                    data: undefined,
                });

                return;
            }

            toast.update(ACCOUNT_MERGE_TOAST_ID, {
                title: 'Операция недоступна',
                description:
                    'Не удалось подтвердить состояние синхронизации. Обновите страницу, чтобы загрузить актуальные данные аккаунта.',
                type: 'error',
                timeout: 20000,
                actionProps: {
                    children: 'Обновить страницу',
                    onClick: () => {
                        window.location.reload();
                    },
                },
                data: undefined,
            });
        } catch (error) {
            console.error('Failed to cancel account merge:', error);

            toast.update(ACCOUNT_MERGE_TOAST_ID, {
                title: 'Не удалось подтвердить отмену',
                description: 'Проверьте соединение и попробуйте ещё раз',
                type: 'error',
                timeout: 0,
                actionProps: {
                    children: 'Повторить отмену',
                    onClick: () => {
                        void handleCancel();
                    },
                },
                data: undefined,
            });
        } finally {
            isCancellingRef.current = false;
        }
    }

    useEffect(() => {
        function getRetryableErrorOptions() {
            return {
                title: 'Ошибка синхронизации данных аккаунта',
                description:
                    'Данные корзины и избранного могут отсутствовать или отображаться не полностью. Повторите попытку',
                type: 'error',
                timeout: 0,
                actionProps: {
                    children: 'Повторить',
                    onClick: () => {
                        void handleRetry();
                    },
                },
                data: {
                    secondaryActionProps: {
                        children: 'Отмена',
                        onClick: () => {
                            setIsCancelDialogOpen(true);
                        },
                    },
                },
            };
        }

        function getUnavailableErrorOptions() {
            return {
                title: 'Операция недоступна',
                description:
                    'Не удалось подтвердить состояние синхронизации. Обновите страницу, чтобы загрузить актуальные данные аккаунта.',
                type: 'error',
                timeout: 20000,
                actionProps: {
                    children: 'Обновить страницу',
                    onClick: () => {
                        window.location.reload();
                    },
                },
                data: undefined,
            };
        }

        async function handleRetry() {
            if (isRetryingRef.current) {
                return;
            }

            isRetryingRef.current = true;

            toast.update(ACCOUNT_MERGE_TOAST_ID, {
                title: 'Синхронизируем данные аккаунта...',
                description: undefined,
                type: 'loading',
                actionProps: undefined,
                data: undefined,
            });

            try {
                const result = await retryAccountMerge();

                if (result.status === 'success') {
                    if (result.cartError) {
                        toast.update(ACCOUNT_MERGE_TOAST_ID, {
                            title: 'Данные аккаунта синхронизированы, но не удалось обновить корзину',
                            description:
                                'Обновите страницу, чтобы загрузить актуальное состояние корзины',
                            timeout: 0,
                            type: 'error',
                            actionProps: {
                                children: 'Обновить страницу',
                                onClick: () => {
                                    window.location.reload();
                                },
                            },
                            data: undefined,
                        });

                        return;
                    }

                    if (result.cart) {
                        replaceCartData(result.cart);
                    }

                    toast.update(ACCOUNT_MERGE_TOAST_ID, {
                        title: 'Данные аккаунта синхронизированы',
                        description: undefined,
                        timeout: 3000,
                        type: 'success',
                        actionProps: undefined,
                        data: undefined,
                    });

                    return;
                }

                if (result.status === 'failed') {
                    toast.update(
                        ACCOUNT_MERGE_TOAST_ID,
                        getRetryableErrorOptions(),
                    );

                    return;
                }

                if (result.status === 'unavailable') {
                    toast.update(
                        ACCOUNT_MERGE_TOAST_ID,
                        getUnavailableErrorOptions(),
                    );

                    return;
                }

                toast.update(ACCOUNT_MERGE_TOAST_ID, {
                    title: 'Произошла непредвиденная ошибка',
                    description: 'Попробуйте обновить страницу',
                    type: 'error',
                    timeout: 0,
                    actionProps: {
                        children: 'Обновить страницу',
                        onClick: () => {
                            window.location.reload();
                        },
                    },
                    data: undefined,
                });
            } catch {
                toast.update(
                    ACCOUNT_MERGE_TOAST_ID,
                    getRetryableErrorOptions(),
                );
            } finally {
                isRetryingRef.current = false;
            }
        }

        toast.add({
            id: ACCOUNT_MERGE_TOAST_ID,
            ...getRetryableErrorOptions(),
        });

        return () => {
            toast.close(ACCOUNT_MERGE_TOAST_ID);
        };
    }, [replaceCartData]);

    return (
        <AlertDialog
            open={isCancelDialogOpen}
            onOpenChange={setIsCancelDialogOpen}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Отменить перенос данных?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Данные корзины и избранного не будут перенесены в ваш
                        аккаунт. После отмены восстановить их будет невозможно.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Оставить данные</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={() => {
                            void handleCancel();
                        }}
                    >
                        Отменить перенос
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

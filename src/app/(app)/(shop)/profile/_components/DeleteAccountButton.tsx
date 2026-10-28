'use client';

import { useState } from 'react';

import { deleteAccount } from '@/app/(app)/(shop)/profile/actions';
import { LoadingButton } from '@/components/button/LoadingButton';
import { DeletionDialog } from '@/components/DeletionDialog';
import { toast } from '@/components/ui/toast';

export function DeleteAccountButton() {
    const [isPending, setIsPending] = useState(false);

    async function handleDeleteAccount() {
        setIsPending(true);

        try {
            await deleteAccount();
        } catch {
            toast.add({
                id: 'delete-account-error',
                type: 'error',
                description: 'Не удалось удалить аккаунт. Попробуйте ещё раз.',
            });
        } finally {
            setIsPending(false);
        }
    }

    return (
        <DeletionDialog
            trigger={
                <LoadingButton
                    size="sm"
                    variant="destructive"
                    isLoading={isPending}
                    disabled={isPending}
                    pendingText="Удаление аккаунта"
                >
                    Удалить аккаунт
                </LoadingButton>
            }
            title="Удалить аккаунт?"
            description="Восстановить аккаунт будет невозможно."
            confirmLabel="Удалить аккаунт"
            onConfirm={handleDeleteAccount}
        />
    );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authClient } from '@/auth/client';
import { Button } from '@/components/shared/Button';

export function DeleteUserButton() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    async function handleClick() {
        setIsPending(true);

        const { error } = await authClient.deleteUser({
            callbackURL: '/',
        });

        if (error) {
            setIsPending(false);
            return;
        }

        router.push('/');
    }

    return (
        <Button
            disabled={isPending}
            onClick={handleClick}
            variant="destructive"
        >
            Удалить аккаунт
        </Button>
    );
}

'use client';

import { useRouter } from 'next/navigation';

import { authClient } from '@/auth/client';
import { Button } from '@/components/shared/Button';

export function SignOutButton() {
    const router = useRouter();

    async function handleClick() {
        await authClient.signOut();

        router.push('/');
    }

    return <Button onClick={handleClick}>Выйти</Button>;
}

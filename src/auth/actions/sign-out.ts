'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import { routes } from '@/routes';

export async function signOut(): Promise<void> {
    await auth.api.signOut({
        headers: await headers(),
    });

    redirect(routes.homePage());
}

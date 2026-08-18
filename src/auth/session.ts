import { headers } from 'next/headers';

import { auth } from './auth';
import { cache } from 'react';

export const getSession = cache(async () => {
    return auth.api.getSession({
        headers: await headers(),
    });
});

export async function requireSession() {
    const session = await getSession();

    if (!session) {
        throw new Error('Session not found.');
    }

    return session;
}

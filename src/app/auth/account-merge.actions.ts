'use server';

import { headers } from 'next/headers';

import { auth } from '@/auth/auth';

export async function getPendingAccountMerge() {
    const result = await auth.api.getPendingAccountMerge({
        headers: await headers(),
    });

    return result.hasPendingMerge;
}

export async function retryAccountMerge() {
    const result = await auth.api.retryAccountMerge({
        headers: await headers(),
    });

    if (!result.success) {
        throw new Error('Failed to retry account merge');
    }

    return result;
}

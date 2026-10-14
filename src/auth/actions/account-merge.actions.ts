'use server';

import { headers } from 'next/headers';

import type { RetryAccountMergeActionResult } from '@/auth/account-merge.types';
import { auth } from '@/auth/auth';
import { requireAuthenticatedUser } from '@/auth/session';
import { getReconciledCart } from '@/services/cart/cart.service';

export async function getPendingAccountMerge(): Promise<boolean> {
    const result = await auth.api.getPendingAccountMerge({
        headers: await headers(),
    });

    return result.hasPendingMerge;
}

export async function retryAccountMerge(): Promise<RetryAccountMergeActionResult> {
    const user = await requireAuthenticatedUser();

    const mergeResult = await auth.api.retryAccountMerge({
        headers: await headers(),
    });

    if (mergeResult.status !== 'success') {
        return {
            status: mergeResult.status,
            cart: null,
            cartError: false,
        };
    }

    try {
        const cart = await getReconciledCart(user.id);

        return {
            status: mergeResult.status,
            cart,
            cartError: false,
        };
    } catch {
        return {
            status: mergeResult.status,
            cart: null,
            cartError: true,
        };
    }
}

export async function cancelAccountMerge() {
    return auth.api.cancelAccountMerge({
        headers: await headers(),
    });
}

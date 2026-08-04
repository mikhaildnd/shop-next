import { cookies } from 'next/headers';

import { authCookieDefaultOptions } from '@/auth/cookies/cookies.config';
import {
    VERIFY_EMAIL_COOKIE,
    VERIFY_EMAIL_COOKIE_MAX_AGE,
} from '@/auth/cookies/cookies.consts';

export async function setVerifyEmailCookie(email: string) {
    const cookieStore = await cookies();

    cookieStore.set(VERIFY_EMAIL_COOKIE, email, {
        ...authCookieDefaultOptions,
        maxAge: VERIFY_EMAIL_COOKIE_MAX_AGE,
    });
}

export async function getVerifyEmailCookie() {
    const cookieStore = await cookies();

    return cookieStore.get(VERIFY_EMAIL_COOKIE)?.value ?? null;
}

export async function clearVerifyEmailCookie() {
    const cookieStore = await cookies();

    cookieStore.delete(VERIFY_EMAIL_COOKIE);
}

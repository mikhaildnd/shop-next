import { cookies } from 'next/headers';

import { authCookieDefaultOptions } from '@/auth/cookies/cookies.config';
import {
    PASSWORD_RESET_COOKIE,
    PASSWORD_RESET_COOKIE_MAX_AGE,
} from '@/auth/cookies/cookies.consts';

type PasswordResetCookieValue = {
    email: string;
    otp?: string;
};

export async function setPasswordResetCookie(value: PasswordResetCookieValue) {
    const cookieStore = await cookies();

    cookieStore.set(PASSWORD_RESET_COOKIE, JSON.stringify(value), {
        ...authCookieDefaultOptions,
        maxAge: PASSWORD_RESET_COOKIE_MAX_AGE,
    });
}

export async function getPasswordResetCookie(): Promise<PasswordResetCookieValue | null> {
    const cookieStore = await cookies();

    const value = cookieStore.get(PASSWORD_RESET_COOKIE)?.value;

    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value) as PasswordResetCookieValue;
    } catch {
        return null;
    }
}

export async function clearPasswordResetCookie() {
    const cookieStore = await cookies();

    cookieStore.delete(PASSWORD_RESET_COOKIE);
}

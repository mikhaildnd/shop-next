import { cookies } from 'next/headers';

import { authCookieDefaultOptions } from '@/auth/cookies/cookies.config';

interface CreateCookieStorageOptions {
    name: string;
    maxAge: number;
}

interface CookieStorage<T> {
    set(value: T): Promise<void>;
    get(): Promise<T | null>;
    clear(): Promise<void>;
}

export function createCookieStorage<T>({
    name,
    maxAge,
}: CreateCookieStorageOptions): CookieStorage<T> {
    return {
        async set(value: T) {
            const cookieStore = await cookies();

            cookieStore.set(name, JSON.stringify(value), {
                ...authCookieDefaultOptions,
                maxAge,
            });
        },

        async get(): Promise<T | null> {
            const cookieStore = await cookies();

            const value = cookieStore.get(name)?.value;

            if (!value) {
                return null;
            }

            try {
                return JSON.parse(value) as T;
            } catch {
                return null;
            }
        },

        async clear() {
            const cookieStore = await cookies();

            cookieStore.delete(name);
        },
    };
}

import { createCookieStorage } from '@/auth/cookies/cookie-storage';
import {
    VERIFY_EMAIL_COOKIE,
    VERIFY_EMAIL_COOKIE_MAX_AGE,
} from '@/auth/cookies/cookies.consts';

type VerifyEmailCookie = {
    email: string;
};

export const verifyEmailCookie = createCookieStorage<VerifyEmailCookie>({
    name: VERIFY_EMAIL_COOKIE,
    maxAge: VERIFY_EMAIL_COOKIE_MAX_AGE,
});

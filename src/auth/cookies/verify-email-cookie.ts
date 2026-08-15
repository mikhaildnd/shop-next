import { createCookieStorage } from '@/auth/cookies/cookie-storage';
import {
    VERIFY_EMAIL_COOKIE,
    VERIFY_EMAIL_COOKIE_MAX_AGE,
} from '@/auth/cookies/cookies.constants';

type EmailVerificationSource = 'sign-up' | 'sign-in';

type VerifyEmailCookie = {
    email: string;
    source: EmailVerificationSource;
};

export const verifyEmailCookie = createCookieStorage<VerifyEmailCookie>({
    name: VERIFY_EMAIL_COOKIE,
    maxAge: VERIFY_EMAIL_COOKIE_MAX_AGE,
});

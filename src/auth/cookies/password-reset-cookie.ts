import { createCookieStorage } from '@/auth/cookies/cookie-storage';
import {
    PASSWORD_RESET_COOKIE,
    PASSWORD_RESET_COOKIE_MAX_AGE,
} from '@/auth/cookies/cookies.constants';

type PasswordResetCookie = {
    email: string;
    otp?: string;
};

export const passwordResetCookie = createCookieStorage<PasswordResetCookie>({
    name: PASSWORD_RESET_COOKIE,
    maxAge: PASSWORD_RESET_COOKIE_MAX_AGE,
});

import { createCookieStorage } from '@/auth/cookies/cookie-storage';
import {
    CHANGE_EMAIL_COOKIE,
    CHANGE_EMAIL_COOKIE_MAX_AGE,
} from '@/auth/cookies/cookies.consts';

type ChangeEmailCookie = {
    email: string;
};

export const changeEmailCookie = createCookieStorage<ChangeEmailCookie>({
    name: CHANGE_EMAIL_COOKIE,
    maxAge: CHANGE_EMAIL_COOKIE_MAX_AGE,
});

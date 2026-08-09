import type { APIError } from 'better-auth/api';

import {
    AUTH_ERROR_TRANSLATIONS,
    DEFAULT_AUTH_ERROR_MESSAGE,
    UNHANDLED_AUTH_ERROR_MESSAGE,
} from './auth-error-translations';

export function translateAuthError(error: APIError): string {
    const code = error.body?.code;

    if (!code) {
        console.error(UNHANDLED_AUTH_ERROR_MESSAGE, error);

        return DEFAULT_AUTH_ERROR_MESSAGE;
    }

    const translation = AUTH_ERROR_TRANSLATIONS[code];

    if (translation) {
        return translation;
    }

    console.error(UNHANDLED_AUTH_ERROR_MESSAGE, error);

    return DEFAULT_AUTH_ERROR_MESSAGE;
}

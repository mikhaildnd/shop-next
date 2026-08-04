import type { APIError } from 'better-auth/api';

import {
    AUTH_ERROR_MESSAGES,
    DEFAULT_AUTH_ERROR_MESSAGE,
    UNHANDLED_AUTH_ERROR_MESSAGE,
} from '@/auth/errors/auth-error-messages';

export function mapAuthError(error: APIError): string {
    const code = error.body?.code;

    if (code) {
        const message = AUTH_ERROR_MESSAGES.get(code);

        if (message) {
            return message;
        }
    }

    console.error(UNHANDLED_AUTH_ERROR_MESSAGE, error);

    return DEFAULT_AUTH_ERROR_MESSAGE;
}

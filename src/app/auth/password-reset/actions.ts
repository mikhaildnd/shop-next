'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    AUTH_FORM_FIELDS,
    PASSWORD_RESET_ATTEMPTS,
    PASSWORD_RESET_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import type {
    AuthPasswordResetForm,
    AuthPasswordResetFormErrors,
} from '@/auth/auth.types';
import { passwordResetCookie } from '@/auth/cookies/password-reset-cookie';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import { validatePasswordResetForm } from '@/auth/validation/password-reset';
import { routes } from '@/lib/routes';
import { consumeRateLimit } from '@/services/rate-limit/rate-limit.service';
import type { RateLimitState } from '@/services/rate-limit/rate-limit.types';

interface RequestPasswordResetState {
    values?: AuthPasswordResetForm;
    fieldErrors?: AuthPasswordResetFormErrors;
    formError?: string;
    rateLimit?: RateLimitState;
}

export async function requestPasswordReset(
    _: RequestPasswordResetState,
    formData: FormData,
): Promise<RequestPasswordResetState> {
    const form: AuthPasswordResetForm = {
        email: String(formData.get(AUTH_FORM_FIELDS.email) ?? ''),
    };

    const fieldErrors = validatePasswordResetForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            values: form,
            fieldErrors,
        };
    }

    const rateLimit = await consumeRateLimit({
        action: 'password-reset',
        identifier: form.email,
        windowSeconds: PASSWORD_RESET_TIMEOUT_SECONDS,
        max: PASSWORD_RESET_ATTEMPTS,
    });

    if (!rateLimit.allowed) {
        return {
            values: form,
            rateLimit,
        };
    }

    const requestHeaders = await headers();

    try {
        await auth.api.requestPasswordResetEmailOTP({
            body: form,
            headers: requestHeaders,
        });
    } catch (error) {
        if (isAPIError(error)) {
            return {
                values: form,
                formError: mapAuthError(error),
            };
        }

        throw error;
    }

    await passwordResetCookie.set({
        email: form.email,
    });

    redirect(routes.passwordResetVerifyPage());
}

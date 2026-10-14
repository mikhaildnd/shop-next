'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    PASSWORD_RESET_ATTEMPT_LIFETIME_SECONDS,
    PASSWORD_RESET_ATTEMPTS,
    PASSWORD_RESET_TIMEOUT_SECONDS,
} from '@/auth/auth.constants';
import type {
    AuthPasswordResetForm,
    AuthPasswordResetFormErrors,
} from '@/auth/auth.types';
import { passwordResetCookie } from '@/auth/cookies/password-reset-cookie';
import { translateAuthError } from '@/auth/errors/translate-auth-error';
import { validatePasswordResetForm } from '@/auth/form-validators/password-reset';
import { routes } from '@/routes';
import {
    activateRateLimit,
    consumeRateLimit,
    getRateLimitState,
} from '@/services/rate-limit/rate-limit.service';
import type { ActiveRateLimit } from '@/services/rate-limit/rate-limit.types';

interface RequestPasswordResetState {
    values?: AuthPasswordResetForm;
    fieldErrors?: AuthPasswordResetFormErrors;
    formError?: string;
    activeRateLimit?: ActiveRateLimit;
    remainingAttempts?: number;
}

export async function requestPasswordReset(
    _: RequestPasswordResetState,
    formData: FormData,
): Promise<RequestPasswordResetState> {
    const form: AuthPasswordResetForm = {
        email: String(formData.get('email') ?? ''),
    };

    const fieldErrors = validatePasswordResetForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            values: { email: form.email },
            fieldErrors,
        };
    }

    const activeRateLimit = await getRateLimitState({
        action: 'password-reset',
        identifier: form.email,
    });

    if (activeRateLimit) {
        return {
            values: {
                email: form.email,
            },
            activeRateLimit,
        };
    }

    const consumeResult = await consumeRateLimit({
        action: 'password-reset',
        identifier: form.email,
        max: PASSWORD_RESET_ATTEMPTS,
        attemptLifetimeSeconds: PASSWORD_RESET_ATTEMPT_LIFETIME_SECONDS,
    });

    const requestHeaders = await headers();

    try {
        await auth.api.requestPasswordResetEmailOTP({
            body: form,
            headers: requestHeaders,
        });

        if (consumeResult.remainingAttempts === 0) {
            await activateRateLimit({
                action: 'password-reset',
                identifier: form.email,
                windowSeconds: PASSWORD_RESET_TIMEOUT_SECONDS,
            });
        }
    } catch (error) {
        if (isAPIError(error)) {
            return {
                values: {
                    email: form.email,
                },
                formError: translateAuthError(error),
                remainingAttempts: consumeResult.remainingAttempts,
            };
        }

        throw error;
    }

    await passwordResetCookie.set({
        email: form.email,
    });

    redirect(routes.passwordResetVerifyPage());
}

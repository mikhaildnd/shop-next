'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    EMAIL_CHANGE_ATTEMPT_LIFETIME_SECONDS,
    EMAIL_CHANGE_ATTEMPTS,
    EMAIL_CHANGE_TIMEOUT_SECONDS,
} from '@/auth/auth.constants';
import type { ChangeEmailForm, ChangeEmailFormErrors } from '@/auth/auth.types';
import { changeEmailCookie } from '@/auth/cookies/change-email-cookie';
import { translateAuthError } from '@/auth/errors/translate-auth-error';
import { validateChangeEmailForm } from '@/auth/form-validators/change-email';
import { getSession } from '@/auth/session';
import { routes } from '@/routes';
import {
    activateRateLimit,
    consumeRateLimit,
    getRateLimitState,
} from '@/services/rate-limit/rate-limit.service';
import type { ActiveRateLimit } from '@/services/rate-limit/rate-limit.types';

interface ChangeEmailState {
    values?: ChangeEmailForm;
    fieldErrors?: ChangeEmailFormErrors;
    formError?: string;
    activeRateLimit?: ActiveRateLimit;
    remainingAttempts?: number;
}

export async function requestChangeEmail(
    _: ChangeEmailState,
    formData: FormData,
): Promise<ChangeEmailState> {
    const session = await getSession();

    if (!session) {
        redirect(routes.signInPage());
    }

    const form: ChangeEmailForm = {
        email: String(formData.get('email') ?? ''),
    };

    const fieldErrors: ChangeEmailFormErrors = validateChangeEmailForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
            values: {
                email: form.email,
            },
        };
    }

    const activeRateLimit = await getRateLimitState({
        action: 'change-email',
        identifier: session.user.id,
    });

    if (activeRateLimit) {
        return {
            values: { email: form.email },
            activeRateLimit,
        };
    }

    const consumeResult = await consumeRateLimit({
        action: 'change-email',
        identifier: session.user.id,
        max: EMAIL_CHANGE_ATTEMPTS,
        attemptLifetimeSeconds: EMAIL_CHANGE_ATTEMPT_LIFETIME_SECONDS,
    });

    const requestHeaders = await headers();

    try {
        await auth.api.requestEmailChangeEmailOTP({
            body: {
                newEmail: form.email,
            },
            headers: requestHeaders,
        });

        if (consumeResult.remainingAttempts === 0) {
            await activateRateLimit({
                action: 'change-email',
                identifier: session.user.id,
                windowSeconds: EMAIL_CHANGE_TIMEOUT_SECONDS,
            });
        }
    } catch (error) {
        if (isAPIError(error)) {
            return {
                values: { email: form.email },
                formError: translateAuthError(error),
                remainingAttempts: consumeResult.remainingAttempts,
            };
        }

        throw error;
    }

    await changeEmailCookie.set({
        email: form.email,
    });

    redirect(routes.changeEmailVerifyPage());
}

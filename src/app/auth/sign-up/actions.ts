'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    SIGN_UP_ATTEMPT_LIFETIME_SECONDS,
    SIGN_UP_ATTEMPTS,
    SIGN_UP_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import type { AuthSignUpForm, AuthSignUpFormErrors } from '@/auth/auth.types';
import { verifyEmailCookie } from '@/auth/cookies/verify-email-cookie';
import { translateAuthError } from '@/auth/errors/translate-auth-error';
import { validateSignUpEmailForm } from '@/auth/form-validators/sign-up-email';
import { routes } from '@/lib/routes';
import {
    activateRateLimit,
    consumeRateLimit,
    getRateLimitState,
} from '@/services/rate-limit/rate-limit.service';
import type { ActiveRateLimit } from '@/services/rate-limit/rate-limit.types';

export interface SignUpState {
    formError?: string;
    fieldErrors?: AuthSignUpFormErrors;
    values?: Pick<AuthSignUpForm, 'email' | 'name'>;
    activeRateLimit?: ActiveRateLimit;
    remainingAttempts?: number;
}

export async function signUp(
    _: SignUpState,
    formData: FormData,
): Promise<SignUpState> {
    const form: AuthSignUpForm = {
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
        confirmPassword: String(formData.get('confirmPassword') ?? ''),
    };

    const fieldErrors: AuthSignUpFormErrors = validateSignUpEmailForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
            values: {
                name: form.name,
                email: form.email,
            },
        };
    }

    const activeRateLimit = await getRateLimitState({
        action: 'sign-up',
        identifier: form.email,
    });

    if (activeRateLimit) {
        return {
            values: {
                name: form.name,
                email: form.email,
            },
            activeRateLimit,
        };
    }

    const consumeResult = await consumeRateLimit({
        action: 'sign-up',
        identifier: form.email,
        max: SIGN_UP_ATTEMPTS,
        attemptLifetimeSeconds: SIGN_UP_ATTEMPT_LIFETIME_SECONDS,
    });

    let currentRateLimit: ActiveRateLimit | undefined;

    if (consumeResult.remainingAttempts === 0) {
        currentRateLimit =
            (await activateRateLimit({
                action: 'sign-up',
                identifier: form.email,
                windowSeconds: SIGN_UP_TIMEOUT_SECONDS,
            })) ?? undefined;
    }

    const requestHeaders = await headers();

    try {
        await auth.api.signUpEmail({
            body: form,
            headers: requestHeaders,
        });
    } catch (error) {
        if (isAPIError(error)) {
            return {
                values: {
                    name: form.name,
                    email: form.email,
                },
                formError: translateAuthError(error),
                activeRateLimit: currentRateLimit,
                remainingAttempts:
                    currentRateLimit === undefined
                        ? consumeResult.remainingAttempts
                        : undefined,
            };
        }

        throw error;
    }

    await verifyEmailCookie.set({
        email: form.email,
        source: 'sign-up',
    });

    redirect(routes.emailVerificationPage());
}

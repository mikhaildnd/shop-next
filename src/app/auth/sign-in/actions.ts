'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    SIGN_IN_ATTEMPT_LIFETIME_SECONDS,
    SIGN_IN_ATTEMPTS,
    SIGN_IN_TIMEOUT_SECONDS,
    SIGN_UP_OTP_ATTEMPT_LIFETIME_SECONDS,
    SIGN_UP_OTP_ATTEMPTS,
    SIGN_UP_OTP_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import type { AuthSignInForm, AuthSignInFormErrors } from '@/auth/auth.types';
import { verifyEmailCookie } from '@/auth/cookies/verify-email-cookie';
import { translateAuthError } from '@/auth/errors/translate-auth-error';
import { validateSignInEmailForm } from '@/auth/form-validators/sign-in-email';
import { routes } from '@/lib/routes';
import {
    activateRateLimit,
    consumeRateLimit,
    deleteRateLimit,
    getRateLimitState,
} from '@/services/rate-limit/rate-limit.service';
import type { ActiveRateLimit } from '@/services/rate-limit/rate-limit.types';

export interface SignInState {
    formError?: string;
    fieldErrors?: AuthSignInFormErrors;
    values?: Pick<AuthSignInForm, 'email'>;
    activeRateLimit?: ActiveRateLimit;
    remainingAttempts?: number;
    requiresEmailVerification?: boolean;
}

export async function signIn(
    _: SignInState,
    formData: FormData,
): Promise<SignInState> {
    const form: AuthSignInForm = {
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
    };

    const fieldErrors = validateSignInEmailForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
            values: {
                email: form.email,
            },
        };
    }

    const activeRateLimit = await getRateLimitState({
        action: 'sign-in',
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
        action: 'sign-in',
        identifier: form.email,
        max: SIGN_IN_ATTEMPTS,
        attemptLifetimeSeconds: SIGN_IN_ATTEMPT_LIFETIME_SECONDS,
    });

    const requestHeaders = await headers();

    try {
        await auth.api.signInEmail({
            body: form,
            headers: requestHeaders,
        });

        await deleteRateLimit({
            action: 'sign-in',
            identifier: form.email,
        });
    } catch (error) {
        if (isAPIError(error)) {
            let activeRateLimit: ActiveRateLimit | undefined;

            if (consumeResult.remainingAttempts === 0) {
                activeRateLimit =
                    (await activateRateLimit({
                        action: 'sign-in',
                        identifier: form.email,
                        windowSeconds: SIGN_IN_TIMEOUT_SECONDS,
                    })) ?? undefined;
            }

            return {
                values: {
                    email: form.email,
                },
                formError: translateAuthError(error),
                activeRateLimit,
                remainingAttempts:
                    activeRateLimit === undefined
                        ? consumeResult.remainingAttempts
                        : undefined,
                requiresEmailVerification:
                    error.body?.code === 'EMAIL_NOT_VERIFIED',
            };
        }

        throw error;
    }

    redirect(routes.profilePage());
}

interface SendVerificationOtpState {
    formError?: string;
    activeRateLimit?: ActiveRateLimit;
    remainingAttempts?: number;
}

export async function sendVerificationOtp(
    _: SendVerificationOtpState,
    formData: FormData,
): Promise<SendVerificationOtpState> {
    const email = String(formData.get('email') ?? '');

    const activeRateLimit = await getRateLimitState({
        action: 'sign-up-otp',
        identifier: email,
    });

    if (activeRateLimit) {
        return {
            activeRateLimit,
        };
    }

    const consumeResult = await consumeRateLimit({
        action: 'sign-up-otp',
        identifier: email,
        max: SIGN_UP_OTP_ATTEMPTS,
        attemptLifetimeSeconds: SIGN_UP_OTP_ATTEMPT_LIFETIME_SECONDS,
    });

    const requestHeaders = await headers();

    try {
        await auth.api.sendVerificationOTP({
            body: {
                email,
                type: 'email-verification',
            },
            headers: requestHeaders,
        });

        await verifyEmailCookie.set({
            email,
            source: 'sign-in',
        });
    } catch (error) {
        if (isAPIError(error)) {
            return {
                formError: translateAuthError(error),
                remainingAttempts: consumeResult.remainingAttempts,
            };
        }

        throw error;
    }

    if (consumeResult.remainingAttempts === 0) {
        await activateRateLimit({
            action: 'sign-up-otp',
            identifier: email,
            windowSeconds: SIGN_UP_OTP_TIMEOUT_SECONDS,
        });
    }

    redirect(routes.emailVerificationPage());
}

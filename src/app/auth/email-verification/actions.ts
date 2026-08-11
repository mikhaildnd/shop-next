'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    SIGN_UP_OTP_ATTEMPT_LIFETIME_SECONDS,
    SIGN_UP_OTP_ATTEMPTS,
    SIGN_UP_OTP_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import type { AuthOtpForm, AuthOtpFormErrors } from '@/auth/auth.types';
import { verifyEmailCookie } from '@/auth/cookies/verify-email-cookie';
import { translateAuthError } from '@/auth/errors/translate-auth-error';
import { validateOtpForm } from '@/auth/form-validators/email-otp';
import { routes } from '@/lib/routes';
import {
    activateRateLimit,
    consumeRateLimit,
    deleteRateLimit,
    getRateLimitState,
} from '@/services/rate-limit/rate-limit.service';
import type { ActiveRateLimit } from '@/services/rate-limit/rate-limit.types';

interface EmailVerificationState {
    formError?: string;
    fieldErrors?: AuthOtpFormErrors;
}

export async function verifyEmailOtp(
    _: EmailVerificationState,
    formData: FormData,
): Promise<EmailVerificationState> {
    const verifyEmail = await verifyEmailCookie.get();

    if (!verifyEmail) {
        redirect(routes.signInPage());
    }

    const { email } = verifyEmail;

    const form: AuthOtpForm = {
        otp: String(formData.get('otp') ?? ''),
    };

    const fieldErrors: AuthOtpFormErrors = validateOtpForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
        };
    }

    const requestHeaders = await headers();

    try {
        await auth.api.verifyEmailOTP({
            body: {
                email,
                otp: form.otp,
            },
            headers: requestHeaders,
        });

        await deleteRateLimit({
            action: 'sign-up-otp',
            identifier: email,
        });

        await deleteRateLimit({
            action: 'sign-in',
            identifier: email,
        });
    } catch (error) {
        if (isAPIError(error)) {
            return {
                formError: translateAuthError(error),
            };
        }

        throw error;
    }

    await verifyEmailCookie.clear();

    redirect(routes.profilePage());
}

export interface ResendVerificationOtpResult {
    success: boolean;
    formError?: string;
    activeRateLimit?: ActiveRateLimit;
    remainingAttempts?: number;
}

export async function resendVerificationOtp(): Promise<ResendVerificationOtpResult> {
    const verifyEmail = await verifyEmailCookie.get();

    if (!verifyEmail) {
        redirect(routes.signInPage());
    }

    const { email } = verifyEmail;

    const activeRateLimit = await getRateLimitState({
        action: 'sign-up-otp',
        identifier: email,
    });

    if (activeRateLimit) {
        return {
            success: false,
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

        let activeRateLimit: ActiveRateLimit | undefined;

        if (consumeResult.remainingAttempts === 0) {
            activeRateLimit =
                (await activateRateLimit({
                    action: 'sign-up-otp',
                    identifier: email,
                    windowSeconds: SIGN_UP_OTP_TIMEOUT_SECONDS,
                })) ?? undefined;
        }

        return {
            success: true,
            activeRateLimit,
            remainingAttempts:
                activeRateLimit === undefined
                    ? consumeResult.remainingAttempts
                    : undefined,
        };
    } catch (error) {
        if (isAPIError(error)) {
            return {
                formError: translateAuthError(error),
                remainingAttempts: consumeResult.remainingAttempts,
                success: false,
            };
        }

        throw error;
    }
}

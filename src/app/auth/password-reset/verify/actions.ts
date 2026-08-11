'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    PASSWORD_RESET_OTP_ATTEMPT_LIFETIME_SECONDS,
    PASSWORD_RESET_OTP_ATTEMPTS,
    PASSWORD_RESET_OTP_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import type { AuthOtpForm, AuthOtpFormErrors } from '@/auth/auth.types';
import { passwordResetCookie } from '@/auth/cookies/password-reset-cookie';
import { translateAuthError } from '@/auth/errors/translate-auth-error';
import { validateOtpForm } from '@/auth/form-validators/email-otp';
import { routes } from '@/lib/routes';
import {
    activateRateLimit,
    consumeRateLimit,
    getRateLimitState,
} from '@/services/rate-limit/rate-limit.service';
import type { ActiveRateLimit } from '@/services/rate-limit/rate-limit.types';

export interface VerifyPasswordResetState {
    formError?: string;
    fieldErrors?: AuthOtpFormErrors;
}

export async function verifyPasswordResetOtp(
    _: VerifyPasswordResetState,
    formData: FormData,
): Promise<VerifyPasswordResetState> {
    const passwordReset = await passwordResetCookie.get();

    if (!passwordReset) {
        redirect(routes.passwordResetPage());
    }

    const { email } = passwordReset;

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
        await auth.api.checkVerificationOTP({
            body: {
                email,
                otp: form.otp,
                type: 'forget-password',
            },
            headers: requestHeaders,
        });

        await passwordResetCookie.set({
            email,
            otp: form.otp,
        });
    } catch (error) {
        if (isAPIError(error)) {
            return {
                formError: translateAuthError(error),
            };
        }

        throw error;
    }

    redirect(routes.passwordSetPage());
}

export interface ResendPasswordResetOtpResult {
    success: boolean;
    formError?: string;
    activeRateLimit?: ActiveRateLimit;
    remainingAttempts?: number;
}

export async function resendPasswordResetOtp(): Promise<ResendPasswordResetOtpResult> {
    const passwordReset = await passwordResetCookie.get();

    if (!passwordReset) {
        redirect(routes.passwordResetPage());
    }

    const { email } = passwordReset;

    const activeRateLimit = await getRateLimitState({
        action: 'password-reset-otp',
        identifier: email,
    });

    if (activeRateLimit) {
        return {
            success: false,
            activeRateLimit,
        };
    }

    const consumeResult = await consumeRateLimit({
        action: 'password-reset-otp',
        identifier: email,
        max: PASSWORD_RESET_OTP_ATTEMPTS,
        attemptLifetimeSeconds: PASSWORD_RESET_OTP_ATTEMPT_LIFETIME_SECONDS,
    });

    const requestHeaders = await headers();

    try {
        await auth.api.sendVerificationOTP({
            body: {
                email,
                type: 'forget-password',
            },
            headers: requestHeaders,
        });

        let activeRateLimit: ActiveRateLimit | undefined;

        if (consumeResult.remainingAttempts === 0) {
            activeRateLimit =
                (await activateRateLimit({
                    action: 'password-reset-otp',
                    identifier: email,
                    windowSeconds: PASSWORD_RESET_OTP_TIMEOUT_SECONDS,
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
                success: false,
            };
        }

        throw error;
    }
}

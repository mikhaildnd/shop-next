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
import type { AuthOtpForm, AuthOtpFormErrors } from '@/auth/auth.types';
import { passwordResetCookie } from '@/auth/cookies/password-reset-cookie';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import { validateEmailOtpForm } from '@/auth/validation/email-otp';
import { routes } from '@/lib/routes';
import { consumeRateLimit } from '@/services/rate-limit/rate-limit.service';
import type { RateLimitState } from '@/services/rate-limit/rate-limit.types';

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
        otp: String(formData.get(AUTH_FORM_FIELDS.otp) ?? ''),
    };

    const fieldErrors: AuthOtpFormErrors = validateEmailOtpForm(form);

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
                formError: mapAuthError(error),
            };
        }

        throw error;
    }

    redirect(routes.passwordSetPage());
}

export interface ResendPasswordResetOtpResult {
    formError?: string;
    success: boolean;
    rateLimit?: RateLimitState;
}

export async function resendPasswordResetOtp(): Promise<ResendPasswordResetOtpResult> {
    const passwordReset = await passwordResetCookie.get();

    if (!passwordReset) {
        redirect(routes.passwordResetPage());
    }

    const { email } = passwordReset;

    const rateLimit = await consumeRateLimit({
        action: 'password-reset',
        identifier: email,
        windowSeconds: PASSWORD_RESET_TIMEOUT_SECONDS,
        max: PASSWORD_RESET_ATTEMPTS,
    });

    if (!rateLimit.allowed) {
        return {
            rateLimit,
            success: false,
        };
    }

    const requestHeaders = await headers();

    try {
        await auth.api.sendVerificationOTP({
            body: {
                email,
                type: 'forget-password',
            },
            headers: requestHeaders,
        });

        return {
            rateLimit,
            success: true,
        };
    } catch (error) {
        if (isAPIError(error)) {
            return {
                formError: mapAuthError(error),
                success: false,
            };
        }

        throw error;
    }
}

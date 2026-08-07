'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    AUTH_FORM_FIELDS,
    SIGN_UP_ATTEMPTS,
    SIGN_UP_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import type { AuthOtpForm, AuthOtpFormErrors } from '@/auth/auth.types';
import { verifyEmailCookie } from '@/auth/cookies/verify-email-cookie';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import { validateEmailOtpForm } from '@/auth/validation/email-otp';
import { routes } from '@/lib/routes';
import { consumeRateLimit } from '@/services/rate-limit/rate-limit.service';
import type { RateLimitState } from '@/services/rate-limit/rate-limit.types';

export interface VerifyEmailState {
    formError?: string;
    fieldErrors?: AuthOtpFormErrors;
}

export async function verifyEmail(
    _: VerifyEmailState,
    formData: FormData,
): Promise<VerifyEmailState> {
    const verifyEmail = await verifyEmailCookie.get();

    if (!verifyEmail) {
        redirect(routes.signInPage());
    }

    const { email } = verifyEmail;

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
        await auth.api.verifyEmailOTP({
            body: {
                email,
                otp: form.otp,
            },
            headers: requestHeaders,
        });
    } catch (error) {
        if (isAPIError(error)) {
            return {
                formError: mapAuthError(error),
            };
        }

        throw error;
    }

    await verifyEmailCookie.clear();

    redirect(routes.profilePage());
}

export interface ResendVerificationOtpResult {
    formError?: string;
    rateLimit?: RateLimitState;
    success: boolean;
}

export async function resendVerificationOtp(): Promise<ResendVerificationOtpResult> {
    const verifyEmail = await verifyEmailCookie.get();

    if (!verifyEmail) {
        redirect(routes.signInPage());
    }

    const { email } = verifyEmail;

    const rateLimit = await consumeRateLimit({
        action: 'sign-up',
        identifier: email,
        windowSeconds: SIGN_UP_TIMEOUT_SECONDS,
        max: SIGN_UP_ATTEMPTS,
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
                type: 'email-verification',
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

export async function restartSignUp() {
    redirect(routes.signUpPage());
}

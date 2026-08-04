'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    AUTH_FORM_FIELDS,
    OTP_RESEND_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import type { AuthOtpForm, AuthOtpFormErrors } from '@/auth/auth.types';
import {
    getPasswordResetCookie,
    setPasswordResetCookie,
} from '@/auth/cookies/password-reset-cookie';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import { getOtpRetryAfter, setOtpCooldown } from '@/auth/services/otp.service';
import { validateEmailOtpForm } from '@/auth/validation/email-otp';
import { OtpPurpose } from '@/generated/prisma/client';
import { routes } from '@/lib/routes';

export interface VerifyPasswordResetState {
    formError?: string;
    fieldErrors?: AuthOtpFormErrors;
}

export interface ResendPasswordResetOtpResult {
    formError?: string;
    successMessage?: string;
    retryAfterSeconds?: number;
}

export async function verifyPasswordResetOtp(
    _: VerifyPasswordResetState,
    formData: FormData,
): Promise<VerifyPasswordResetState> {
    const requestHeaders = await headers();

    const passwordReset = await getPasswordResetCookie();

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

    try {
        await auth.api.checkVerificationOTP({
            body: {
                email,
                otp: form.otp,
                type: 'forget-password',
            },
            headers: requestHeaders,
        });

        await setPasswordResetCookie({
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

export async function resendPasswordResetOtp(): Promise<ResendPasswordResetOtpResult> {
    const requestHeaders = await headers();

    const passwordReset = await getPasswordResetCookie();

    if (!passwordReset) {
        redirect(routes.passwordResetPage());
    }

    const { email } = passwordReset;

    const retryAfter = await getOtpRetryAfter({
        identifier: email,
        purpose: OtpPurpose.PASSWORD_RESET,
    });

    if (retryAfter > 0) {
        return {
            formError: 'Код уже был отправлен.',
            retryAfterSeconds: retryAfter,
        };
    }

    try {
        await auth.api.sendVerificationOTP({
            body: {
                email,
                type: 'forget-password',
            },
            headers: requestHeaders,
        });

        await setOtpCooldown({
            identifier: email,
            purpose: OtpPurpose.PASSWORD_RESET,
            duration: OTP_RESEND_TIMEOUT_SECONDS,
        });

        return {
            successMessage: 'Новый код отправлен.',
            retryAfterSeconds: OTP_RESEND_TIMEOUT_SECONDS,
        };
    } catch (error) {
        if (isAPIError(error)) {
            return {
                formError: mapAuthError(error),
            };
        }

        throw error;
    }
}

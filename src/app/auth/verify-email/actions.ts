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
    clearVerifyEmailCookie,
    getVerifyEmailCookie,
} from '@/auth/cookies/verify-email-cookie';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import {
    deleteOtpCooldown,
    getOtpRetryAfter,
    setOtpCooldown,
} from '@/auth/services/otp.service';
import { validateEmailOtpForm } from '@/auth/validation/email-otp';
import { OtpPurpose } from '@/generated/prisma/client';
import { routes } from '@/lib/routes';

export interface VerifyEmailState {
    formError?: string;
    fieldErrors?: AuthOtpFormErrors;
}

export interface ResendVerificationOtpResult {
    formError?: string;
    successMessage?: string;
    retryAfterSeconds?: number;
}

export async function verifyEmail(
    _: VerifyEmailState,
    formData: FormData,
): Promise<VerifyEmailState> {
    const requestHeaders = await headers();

    const email = await getVerifyEmailCookie();

    if (!email) {
        redirect(routes.signInPage());
    }

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

    await clearVerifyEmailCookie();

    await deleteOtpCooldown({
        identifier: email,
        purpose: OtpPurpose.EMAIL_VERIFICATION,
    });

    redirect(routes.profilePage());
}

export async function resendVerificationOtp(): Promise<ResendVerificationOtpResult> {
    const requestHeaders = await headers();

    const email = await getVerifyEmailCookie();

    if (!email) {
        redirect(routes.signInPage());
    }

    const retryAfter = await getOtpRetryAfter({
        identifier: email,
        purpose: OtpPurpose.EMAIL_VERIFICATION,
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
                type: 'email-verification',
            },
            headers: requestHeaders,
        });

        await setOtpCooldown({
            identifier: email,
            purpose: OtpPurpose.EMAIL_VERIFICATION,
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

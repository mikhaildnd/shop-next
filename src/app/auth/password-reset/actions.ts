'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    AUTH_FORM_FIELDS,
    OTP_RESEND_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import type {
    AuthPasswordResetForm,
    AuthPasswordResetFormErrors,
} from '@/auth/auth.types';
import { setPasswordResetCookie } from '@/auth/cookies/password-reset-cookie';
import { setVerifyEmailCookie } from '@/auth/cookies/verify-email-cookie';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import { getOtpRetryAfter, setOtpCooldown } from '@/auth/services/otp.service';
import { validatePasswordResetForm } from '@/auth/validation/password-reset';
import { OtpPurpose } from '@/generated/prisma/client';
import { routes } from '@/lib/routes';
import { getUserByEmail } from '@/services/user/user.service';

export interface RequestPasswordResetState {
    values?: AuthPasswordResetForm;
    fieldErrors?: AuthPasswordResetFormErrors;
    formError?: string;
}

export async function requestPasswordReset(
    _: RequestPasswordResetState,
    formData: FormData,
): Promise<RequestPasswordResetState> {
    const requestHeaders = await headers();

    const form: AuthPasswordResetForm = {
        email: String(formData.get(AUTH_FORM_FIELDS.email) ?? ''),
    };

    const fieldErrors = validatePasswordResetForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            values: form,
            fieldErrors,
        };
    }

    const user = await getUserByEmail(form.email);

    if (user && !user.emailVerified) {
        const retryAfter = await getOtpRetryAfter({
            identifier: form.email,
            purpose: OtpPurpose.EMAIL_VERIFICATION,
        });

        if (retryAfter === 0) {
            await auth.api.sendVerificationOTP({
                body: {
                    email: form.email,
                    type: 'email-verification',
                },
                headers: requestHeaders,
            });

            await setOtpCooldown({
                identifier: form.email,
                purpose: OtpPurpose.EMAIL_VERIFICATION,
                duration: OTP_RESEND_TIMEOUT_SECONDS,
            });
        }

        await setVerifyEmailCookie(form.email);

        redirect(routes.verifyEmailPage());
    }

    try {
        await auth.api.requestPasswordResetEmailOTP({
            body: form,
            headers: requestHeaders,
        });
    } catch (error) {
        if (isAPIError(error)) {
            return {
                values: form,
                formError: mapAuthError(error),
            };
        }

        throw error;
    }

    await setPasswordResetCookie({
        email: form.email,
    });

    await setOtpCooldown({
        identifier: form.email,
        purpose: OtpPurpose.PASSWORD_RESET,
        duration: OTP_RESEND_TIMEOUT_SECONDS,
    });

    redirect(routes.passwordResetVerifyPage());
}

'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    AUTH_FORM_FIELDS,
    OTP_RESEND_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import type { AuthSignInForm, AuthSignInFormErrors } from '@/auth/auth.types';
import { setVerifyEmailCookie } from '@/auth/cookies/verify-email-cookie';
import { AUTH_ERROR_CODES } from '@/auth/errors/auth-error-codes';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import { getOtpRetryAfter, setOtpCooldown } from '@/auth/services/otp.service';
import { validateEmailAuthForm } from '@/auth/validation/email-auth';
import { OtpPurpose } from '@/generated/prisma/client';
import { routes } from '@/lib/routes';

// TODO: add "Remember me" option.

export interface SignInState {
    formError?: string;
    fieldErrors?: AuthSignInFormErrors;
    values?: Pick<AuthSignInForm, 'email'>;
}

export async function signIn(
    _: SignInState,
    formData: FormData,
): Promise<SignInState> {
    const requestHeaders = await headers();

    const form: AuthSignInForm = {
        email: String(formData.get(AUTH_FORM_FIELDS.email) ?? ''),
        password: String(formData.get(AUTH_FORM_FIELDS.password) ?? ''),
    };

    const fieldErrors = validateEmailAuthForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
            values: {
                email: form.email,
            },
        };
    }

    try {
        await auth.api.signInEmail({
            body: form,
            headers: requestHeaders,
        });
    } catch (error) {
        if (isAPIError(error)) {
            const code = error.body?.code;

            if (code === AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED.code) {
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

            return {
                formError: mapAuthError(error),
                values: {
                    email: form.email,
                },
            };
        }

        throw error;
    }

    redirect(routes.profilePage());
}

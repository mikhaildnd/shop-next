'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    AUTH_FORM_FIELDS,
    OTP_RESEND_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import type { AuthSignUpForm, AuthSignUpFormErrors } from '@/auth/auth.types';
import { setVerifyEmailCookie } from '@/auth/cookies/verify-email-cookie';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import { getOtpRetryAfter, setOtpCooldown } from '@/auth/services/otp.service';
import { validateEmailRegisterForm } from '@/auth/validation/email-register';
import { OtpPurpose } from '@/generated/prisma/client';
import { routes } from '@/lib/routes';
import { getUserByEmail } from '@/services/user/user.service';

export interface SignUpState {
    formError?: string;
    fieldErrors?: AuthSignUpFormErrors;
    values?: Pick<AuthSignUpForm, 'email' | 'name'>;
    retryAfterSeconds?: number;
}

export async function signUp(
    _: SignUpState,
    formData: FormData,
): Promise<SignUpState> {
    const requestHeaders = await headers();

    const form: AuthSignUpForm = {
        name: String(formData.get(AUTH_FORM_FIELDS.name) ?? ''),
        email: String(formData.get(AUTH_FORM_FIELDS.email) ?? ''),
        password: String(formData.get(AUTH_FORM_FIELDS.password) ?? ''),
        confirmPassword: String(
            formData.get(AUTH_FORM_FIELDS.confirmPassword) ?? '',
        ),
    };

    const fieldErrors: AuthSignUpFormErrors = validateEmailRegisterForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
            values: {
                name: form.name,
                email: form.email,
            },
        };
    }

    const user = await getUserByEmail(form.email);

    if (user?.emailVerified) {
        return {
            formError: 'Пользователь с таким email уже существует.',
        };
    }

    try {
        if (!user) {
            await auth.api.signUpEmail({
                body: form,
                headers: requestHeaders,
            });

            await setOtpCooldown({
                identifier: form.email,
                purpose: OtpPurpose.EMAIL_VERIFICATION,
                duration: OTP_RESEND_TIMEOUT_SECONDS,
            });
        } else {
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
        }

        await setVerifyEmailCookie(form.email);

        redirect(routes.verifyEmailPage());
    } catch (error) {
        if (isAPIError(error)) {
            return {
                formError: mapAuthError(error),
            };
        }

        throw error;
    }
}

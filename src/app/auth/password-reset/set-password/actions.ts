'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import { AUTH_FORM_FIELDS } from '@/auth/auth.consts';
import type {
    AuthPasswordSetForm,
    AuthPasswordSetFormErrors,
} from '@/auth/auth.types';
import {
    clearPasswordResetCookie,
    getPasswordResetCookie,
} from '@/auth/cookies/password-reset-cookie';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import { deleteOtpCooldown } from '@/auth/services/otp.service';
import { validateSetPasswordForm } from '@/auth/validation/set-password';
import { OtpPurpose } from '@/generated/prisma/client';
import { routes } from '@/lib/routes';

export interface SetPasswordState {
    fieldErrors?: AuthPasswordSetFormErrors;
    formError?: string;
}

export async function setPassword(
    _: SetPasswordState,
    formData: FormData,
): Promise<SetPasswordState> {
    const requestHeaders = await headers();

    const passwordReset = await getPasswordResetCookie();

    if (!passwordReset?.otp) {
        redirect(routes.passwordResetVerifyPage());
    }

    const { email, otp } = passwordReset;

    const form: AuthPasswordSetForm = {
        password: String(formData.get(AUTH_FORM_FIELDS.password) ?? ''),
        confirmPassword: String(
            formData.get(AUTH_FORM_FIELDS.confirmPassword) ?? '',
        ),
    };

    const fieldErrors = validateSetPasswordForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
        };
    }

    try {
        await auth.api.resetPasswordEmailOTP({
            body: {
                email,
                otp,
                password: form.password,
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

    await clearPasswordResetCookie();

    await deleteOtpCooldown({
        identifier: email,
        purpose: OtpPurpose.PASSWORD_RESET,
    });

    redirect(routes.signInPage());
}

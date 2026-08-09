'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import type {
    AuthPasswordSetForm,
    AuthPasswordSetFormErrors,
} from '@/auth/auth.types';
import { passwordResetCookie } from '@/auth/cookies/password-reset-cookie';
import { translateAuthError } from '@/auth/errors/translate-auth-error';
import { validateSetPasswordForm } from '@/auth/form-validators/set-password';
import { routes } from '@/lib/routes';
import { deleteRateLimit } from '@/services/rate-limit/rate-limit.service';

export interface SetPasswordState {
    fieldErrors?: AuthPasswordSetFormErrors;
    formError?: string;
}

export async function setPassword(
    _: SetPasswordState,
    formData: FormData,
): Promise<SetPasswordState> {
    const passwordReset = await passwordResetCookie.get();

    if (!passwordReset?.otp) {
        redirect(routes.passwordResetVerifyPage());
    }

    const { email, otp } = passwordReset;

    const form: AuthPasswordSetForm = {
        password: String(formData.get('password') ?? ''),
        confirmPassword: String(formData.get('confirmPassword') ?? ''),
    };

    const fieldErrors = validateSetPasswordForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
        };
    }

    const requestHeaders = await headers();

    try {
        await auth.api.resetPasswordEmailOTP({
            body: {
                email,
                otp,
                password: form.password,
            },
            headers: requestHeaders,
        });

        await deleteRateLimit({
            action: 'password-reset-otp',
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

    await passwordResetCookie.clear();

    redirect(routes.signInPage());
}

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
import type { AuthSignUpForm, AuthSignUpFormErrors } from '@/auth/auth.types';
import { verifyEmailCookie } from '@/auth/cookies/verify-email-cookie';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import { validateEmailRegisterForm } from '@/auth/validation/email-register';
import { routes } from '@/lib/routes';
import { consumeRateLimit } from '@/services/rate-limit/rate-limit.service';
import type { RateLimitState } from '@/services/rate-limit/rate-limit.types';

export interface SignUpState {
    formError?: string;
    fieldErrors?: AuthSignUpFormErrors;
    values?: Pick<AuthSignUpForm, 'email' | 'name'>;
    rateLimit?: RateLimitState;
}

export async function signUp(
    _: SignUpState,
    formData: FormData,
): Promise<SignUpState> {
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

    const requestHeaders = await headers();

    const rateLimit = await consumeRateLimit({
        action: 'sign-up',
        identifier: form.email,
        windowSeconds: SIGN_UP_TIMEOUT_SECONDS,
        max: SIGN_UP_ATTEMPTS,
    });

    if (!rateLimit.allowed) {
        return {
            values: {
                email: form.email,
                name: form.name,
            },
            rateLimit,
        };
    }

    try {
        await auth.api.signUpEmail({
            body: form,
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

    await verifyEmailCookie.set({ email: form.email });

    redirect(routes.verifyEmailPage());
}

'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    AUTH_FORM_FIELDS,
    SIGN_IN_ATTEMPTS,
    SIGN_IN_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import type { AuthSignInForm, AuthSignInFormErrors } from '@/auth/auth.types';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import { validateEmailAuthForm } from '@/auth/validation/email-auth';
import { routes } from '@/lib/routes';
import { consumeRateLimit } from '@/services/rate-limit/rate-limit.service';
import type { RateLimitState } from '@/services/rate-limit/rate-limit.types';

export interface SignInState {
    formError?: string;
    fieldErrors?: AuthSignInFormErrors;
    values?: Pick<AuthSignInForm, 'email'>;
    rateLimit?: RateLimitState;
}

export async function signIn(
    _: SignInState,
    formData: FormData,
): Promise<SignInState> {
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

    const rateLimit = await consumeRateLimit({
        action: 'sign-in',
        identifier: form.email,
        windowSeconds: SIGN_IN_TIMEOUT_SECONDS,
        max: SIGN_IN_ATTEMPTS,
    });

    if (!rateLimit.allowed) {
        return {
            values: {
                email: form.email,
            },
            rateLimit,
        };
    }

    const requestHeaders = await headers();

    try {
        await auth.api.signInEmail({
            body: form,
            headers: requestHeaders,
        });
    } catch (error) {
        if (isAPIError(error)) {
            return {
                values: {
                    email: form.email,
                },
                formError: mapAuthError(error),
            };
        }

        throw error;
    }

    redirect(routes.profilePage());
}

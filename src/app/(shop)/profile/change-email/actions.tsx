'use server';

import { isAPIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { PROFILE_FORM_FIELDS } from '@/app/(shop)/profile/profile.consts';
import type {
    ChangeEmailForm,
    ChangeEmailFormErrors,
} from '@/app/(shop)/profile/profile.types';
import { validateChangeEmailForm } from '@/app/(shop)/profile/validation/user-email';
import { auth } from '@/auth/auth';
import {
    EMAIL_CHANGE_ATTEMPTS,
    EMAIL_CHANGE_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import { changeEmailCookie } from '@/auth/cookies/change-email-cookie';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';
import { consumeRateLimit } from '@/services/rate-limit/rate-limit.service';
import type { RateLimitState } from '@/services/rate-limit/rate-limit.types';

interface ChangeEmailState {
    values?: ChangeEmailForm;
    fieldErrors?: ChangeEmailFormErrors;
    formError?: string;
    rateLimit?: RateLimitState;
}

export async function requestChangeEmail(
    _: ChangeEmailState,
    formData: FormData,
): Promise<ChangeEmailState> {
    const session = await getSession();

    if (!session) {
        redirect(routes.signInPage());
    }

    const form: ChangeEmailForm = {
        email: String(formData.get(PROFILE_FORM_FIELDS.email) ?? ''),
    };

    const fieldErrors: ChangeEmailFormErrors = validateChangeEmailForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
            values: form,
        };
    }

    const rateLimit = await consumeRateLimit({
        action: 'change-email',
        identifier: session.user.id,
        windowSeconds: EMAIL_CHANGE_TIMEOUT_SECONDS,
        max: EMAIL_CHANGE_ATTEMPTS,
    });

    if (!rateLimit.allowed) {
        return {
            values: form,
            rateLimit,
        };
    }

    const requestHeaders = await headers();

    try {
        await auth.api.requestEmailChangeEmailOTP({
            body: {
                newEmail: form.email,
            },
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

    await changeEmailCookie.set({
        email: form.email,
    });

    redirect(routes.profileChangeEmailVerifyPage());
}

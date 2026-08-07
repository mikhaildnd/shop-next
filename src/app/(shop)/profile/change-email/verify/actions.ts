'use server';

import { isAPIError } from 'better-auth/api';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { PROFILE_FORM_FIELDS } from '@/app/(shop)/profile/profile.consts';
import type {
    ChangeEmailOtpForm,
    ChangeEmailOtpFormErrors,
} from '@/app/(shop)/profile/profile.types';
import { validateChangeEmailOtpForm } from '@/app/(shop)/profile/validation/user-email-otp';
import { auth } from '@/auth/auth';
import {
    EMAIL_CHANGE_ATTEMPTS,
    EMAIL_CHANGE_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import { changeEmailCookie } from '@/auth/cookies/change-email-cookie';
import { mapAuthError } from '@/auth/errors/map-auth-error';
import { routes } from '@/lib/routes';
import { consumeRateLimit } from '@/services/rate-limit/rate-limit.service';
import type { RateLimitState } from '@/services/rate-limit/rate-limit.types';

export interface VerifyEmailChangeState {
    formError?: string;
    fieldErrors?: ChangeEmailOtpFormErrors;
}

export async function verifyEmailChangeOtp(
    _: VerifyEmailChangeState,
    formData: FormData,
): Promise<VerifyEmailChangeState> {
    const changeEmail = await changeEmailCookie.get();

    if (!changeEmail) {
        redirect(routes.profileChangeEmailPage());
    }

    const { email } = changeEmail;

    const form: ChangeEmailOtpForm = {
        otp: String(formData.get(PROFILE_FORM_FIELDS.otp) ?? ''),
    };

    const fieldErrors: ChangeEmailOtpFormErrors =
        validateChangeEmailOtpForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
        };
    }

    const requestHeaders = await headers();

    try {
        await auth.api.changeEmailEmailOTP({
            body: {
                newEmail: email,
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

    await changeEmailCookie.clear();

    revalidatePath(routes.profilePage());

    redirect(routes.profilePage());
}

interface ResendEmailChangeOtpResult {
    formError?: string;
    rateLimit?: RateLimitState;
    success: boolean;
}

export async function resendChangeEmailOtp(): Promise<ResendEmailChangeOtpResult> {
    const changeEmail = await changeEmailCookie.get();

    if (!changeEmail) {
        redirect(routes.profileChangeEmailPage());
    }

    const { email } = changeEmail;

    const rateLimit = await consumeRateLimit({
        action: 'change-email',
        identifier: email,
        windowSeconds: EMAIL_CHANGE_TIMEOUT_SECONDS,
        max: EMAIL_CHANGE_ATTEMPTS,
    });

    if (!rateLimit.allowed) {
        return {
            rateLimit,
            success: false,
        };
    }

    const requestHeaders = await headers();

    try {
        await auth.api.requestEmailChangeEmailOTP({
            body: {
                newEmail: email,
            },
            headers: requestHeaders,
        });

        return {
            rateLimit,
            success: true,
        };
    } catch (error) {
        if (isAPIError(error)) {
            return {
                formError: mapAuthError(error),
                success: false,
            };
        }

        throw error;
    }
}

export async function restartEmailChange() {
    redirect(routes.profileChangeEmailPage());
}

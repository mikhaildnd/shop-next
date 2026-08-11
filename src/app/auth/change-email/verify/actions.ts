'use server';

import { isAPIError } from 'better-auth/api';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/auth/auth';
import {
    EMAIL_CHANGE_OTP_ATTEMPT_LIFETIME_SECONDS,
    EMAIL_CHANGE_OTP_ATTEMPTS,
    EMAIL_CHANGE_OTP_TIMEOUT_SECONDS,
} from '@/auth/auth.consts';
import type { AuthOtpForm, AuthOtpFormErrors } from '@/auth/auth.types';
import { changeEmailCookie } from '@/auth/cookies/change-email-cookie';
import { translateAuthError } from '@/auth/errors/translate-auth-error';
import { validateOtpForm } from '@/auth/form-validators/email-otp';
import { requireSession } from '@/auth/session';
import { routes } from '@/lib/routes';
import {
    activateRateLimit,
    consumeRateLimit,
    deleteRateLimit,
    getRateLimitState,
} from '@/services/rate-limit/rate-limit.service';
import type { ActiveRateLimit } from '@/services/rate-limit/rate-limit.types';

export interface VerifyEmailChangeState {
    formError?: string;
    fieldErrors?: AuthOtpFormErrors;
}

export async function verifyEmailChangeOtp(
    _: VerifyEmailChangeState,
    formData: FormData,
): Promise<VerifyEmailChangeState> {
    const session = await requireSession();

    const changeEmail = await changeEmailCookie.get();

    if (!changeEmail) {
        redirect(routes.changeEmailPage());
    }

    const { email } = changeEmail;

    const form: AuthOtpForm = {
        otp: String(formData.get('otp') ?? ''),
    };

    const fieldErrors: AuthOtpFormErrors = validateOtpForm(form);

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

        await deleteRateLimit({
            action: 'change-email-otp',
            identifier: session.user.id,
        });
    } catch (error) {
        if (isAPIError(error)) {
            return {
                formError: translateAuthError(error),
            };
        }

        throw error;
    }

    await changeEmailCookie.clear();

    revalidatePath(routes.profilePage());

    redirect(routes.profilePage());
}

interface ResendEmailChangeOtpResult {
    success: boolean;
    formError?: string;
    activeRateLimit?: ActiveRateLimit;
    remainingAttempts?: number;
}

export async function resendChangeEmailOtp(): Promise<ResendEmailChangeOtpResult> {
    const session = await requireSession();

    const changeEmail = await changeEmailCookie.get();

    if (!changeEmail) {
        redirect(routes.changeEmailPage());
    }

    const { email } = changeEmail;

    const activeRateLimit = await getRateLimitState({
        action: 'change-email-otp',
        identifier: session.user.id,
    });

    if (activeRateLimit) {
        return {
            success: false,
            activeRateLimit,
        };
    }

    const consumeResult = await consumeRateLimit({
        action: 'change-email-otp',
        identifier: session.user.id,
        max: EMAIL_CHANGE_OTP_ATTEMPTS,
        attemptLifetimeSeconds: EMAIL_CHANGE_OTP_ATTEMPT_LIFETIME_SECONDS,
    });

    const requestHeaders = await headers();

    try {
        await auth.api.requestEmailChangeEmailOTP({
            body: {
                newEmail: email,
            },
            headers: requestHeaders,
        });

        let activeRateLimit: ActiveRateLimit | undefined;

        if (consumeResult.remainingAttempts === 0) {
            activeRateLimit =
                (await activateRateLimit({
                    action: 'change-email-otp',
                    identifier: session.user.id,
                    windowSeconds: EMAIL_CHANGE_OTP_TIMEOUT_SECONDS,
                })) ?? undefined;
        }

        return {
            success: true,
            activeRateLimit,
            remainingAttempts:
                activeRateLimit === undefined
                    ? consumeResult.remainingAttempts
                    : undefined,
        };
    } catch (error) {
        if (isAPIError(error)) {
            return {
                success: false,
                formError: translateAuthError(error),
                remainingAttempts: consumeResult.remainingAttempts,
            };
        }

        throw error;
    }
}

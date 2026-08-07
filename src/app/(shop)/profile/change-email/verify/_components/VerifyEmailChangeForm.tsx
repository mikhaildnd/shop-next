'use client';

import { useActionState, useTransition } from 'react';
import { useState } from 'react';

import {
    resendChangeEmailOtp,
    verifyEmailChangeOtp,
} from '@/app/(shop)/profile/change-email/verify/actions';
import { OtpInput } from '@/app/auth/_components/OtpInput';
import { AUTH_FORM_FIELDS, OTP_LENGTH } from '@/auth/auth.consts';
import { LoadingButton } from '@/components/shared/LoadingButton';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import type { RateLimitState } from '@/services/rate-limit/rate-limit.types';

export function VerifyEmailChangeForm() {
    const [state, formAction, isPending] = useActionState(
        verifyEmailChangeOtp,
        {},
    );

    const [rateLimit, setRateLimit] = useState<RateLimitState>();

    const [isResending, startTransition] = useTransition();
    const [resendError, setResendError] = useState<string>();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const retryAfterSeconds = rateLimit?.retryAfterSeconds ?? 0;

    const { secondsLeft } = useCountdownTimer(retryAfterSeconds);

    const hasRateLimit = secondsLeft > 0;

    const handleResend = () => {
        startTransition(async () => {
            setResendError(undefined);
            setShowSuccessMessage(false);

            const { formError, success, rateLimit } =
                await resendChangeEmailOtp();

            if (rateLimit) {
                setRateLimit(rateLimit);
            }

            setResendError(formError);
            setShowSuccessMessage(success);
        });
    };

    return (
        <form
            className="flex flex-col gap-4"
            action={formAction}
        >
            <OtpInput
                name={AUTH_FORM_FIELDS.otp}
                length={OTP_LENGTH}
                error={state.fieldErrors?.otp}
            />

            {state.formError && (
                <p className="text-sm text-red-500">{state.formError}</p>
            )}

            <LoadingButton
                type="submit"
                isLoading={isPending}
                disabled={isPending || isResending}
            >
                Подтвердить код
            </LoadingButton>

            <LoadingButton
                type="button"
                variant="secondary"
                pendingText="Отправка"
                onClick={handleResend}
                isLoading={isResending}
                disabled={isResending || hasRateLimit}
            >
                Отправить код повторно
            </LoadingButton>

            {hasRateLimit && (
                <p className="text-muted-foreground text-sm">
                    Повторная отправка через {secondsLeft} сек.
                </p>
            )}

            {showSuccessMessage && (
                <p className="text-sm text-green-600">Новый код отправлен.</p>
            )}

            {resendError && (
                <p className="text-sm text-red-500">{resendError}</p>
            )}
        </form>
    );
}

'use client';

import { useActionState, useTransition } from 'react';
import { useState } from 'react';

import { OtpInput } from '@/app/auth/_components/OtpInput';
import {
    resendVerificationOtp,
    verifyEmail,
} from '@/app/auth/verify-email/actions';
import { AUTH_FORM_FIELDS, OTP_LENGTH } from '@/auth/auth.consts';
import { LoadingButton } from '@/components/shared/LoadingButton';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';

interface VerifyEmailFormProps {
    initialSeconds: number;
}

export function VerifyEmailForm({ initialSeconds }: VerifyEmailFormProps) {
    const [state, formAction, isPending] = useActionState(verifyEmail, {});

    const [isResending, startTransition] = useTransition();
    const [resendError, setResendError] = useState<string>();
    const [successMessage, setSuccessMessage] = useState<string>();

    const { restart, secondsLeft } = useCountdownTimer(initialSeconds);

    const canResend = secondsLeft === 0;

    const submitAction = (formData: FormData) => {
        formAction(formData);
    };

    const handleResend = () => {
        startTransition(async () => {
            setResendError(undefined);
            setSuccessMessage(undefined);

            const { formError, successMessage, retryAfterSeconds } =
                await resendVerificationOtp();

            if (retryAfterSeconds) {
                restart(retryAfterSeconds);
            }

            setResendError(formError);
            setSuccessMessage(successMessage);
        });
    };

    return (
        <form
            className="flex flex-col gap-4"
            action={submitAction}
            noValidate
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
            >
                Подтвердить код
            </LoadingButton>

            <LoadingButton
                type="button"
                variant="secondary"
                pendingText="Отправка"
                onClick={handleResend}
                isLoading={isResending}
                disabled={isResending || !canResend}
            >
                Отправить код повторно
            </LoadingButton>

            {!canResend && (
                <p className="text-muted-foreground text-sm">
                    Повторная отправка через {secondsLeft} сек.
                </p>
            )}

            {successMessage && (
                <p className="text-sm text-green-600">{successMessage}</p>
            )}

            {resendError && (
                <p className="text-sm text-red-500">{resendError}</p>
            )}
        </form>
    );
}

'use client';

import { useActionState, useTransition } from 'react';
import { useState } from 'react';

import {
    resendChangeEmailOtp,
    verifyEmailChangeOtp,
} from '@/app/auth/change-email/verify/actions';
import { OTP_LENGTH } from '@/auth/auth.consts';
import { OtpInput } from '@/components/form/OtpInput';
import { LoadingButton } from '@/components/shared/LoadingButton';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';

interface VerifyEmailChangeFormProps {
    expiresAt?: number;
}

export function VerifyEmailChangeForm({
    expiresAt: initialExpiresAt,
}: VerifyEmailChangeFormProps) {
    const [state, formAction, isPending] = useActionState(
        verifyEmailChangeOtp,
        {},
    );

    const [expiresAt, setExpiresAt] = useState(initialExpiresAt);

    const [isResending, startTransition] = useTransition();
    const [resendError, setResendError] = useState<string>();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [remainingAttempts, setRemainingAttempts] = useState<number>();

    const { secondsLeft, isRunning } = useCountdownTimer(expiresAt);

    const handleResend = () => {
        startTransition(async () => {
            setResendError(undefined);
            setShowSuccessMessage(false);

            const { formError, success, activeRateLimit, remainingAttempts } =
                await resendChangeEmailOtp();

            setExpiresAt(activeRateLimit?.expiresAt);
            setRemainingAttempts(remainingAttempts);

            if (success) {
                setShowSuccessMessage(true);
                setResendError(undefined);
                return;
            }

            setResendError(formError);
        });
    };

    return (
        <form
            className="flex flex-col gap-4"
            action={formAction}
        >
            <OtpInput
                name="otp"
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
                disabled={isResending || isRunning}
            >
                Отправить код повторно
            </LoadingButton>

            {remainingAttempts !== undefined && remainingAttempts > 0 && (
                <p className="text-sm">Осталось попыток: {remainingAttempts}</p>
            )}

            {isRunning && (
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

'use client';

import { useRouter } from 'next/navigation';
import type { SubmitEventHandler} from 'react';
import { useState } from 'react';

import { AuthCard } from '@/app/auth/_components/AuthCard';
import { FormInput } from '@/app/auth/_components/FormInput';
import { type AuthVerifyEmailFormErrors } from '@/auth/auth.types';
import { authClient } from '@/auth/client';
import { validateEmailOtpForm } from '@/auth/validation/email-otp';
import { LoadingButton } from '@/components/shared/LoadingButton';
import { routes } from '@/lib/routes';

interface VerifyEmailFormProps {
    email: string;
}

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
    const router = useRouter();

    const [otp, setOtp] = useState('');

    const [errors, setErrors] = useState<AuthVerifyEmailFormErrors>({});

    const [isPending, setIsPending] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        setErrors({});

        const errors = validateEmailOtpForm({
            otp,
        });

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        setIsPending(true);

        try {
            const { error } = await authClient.emailOtp.verifyEmail({
                email,
                otp,
            });

            if (error) {
                setErrors({
                    form:
                        error.message ??
                        'Не удалось подтвердить адрес электронной почты',
                });

                return;
            }

            router.replace(routes.homePage());
            router.refresh();
        } finally {
            setIsPending(false);
        }
    };

    const handleResend = async () => {
        setErrors({});
        setIsResending(true);

        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: 'email-verification',
            });

            if (error) {
                setErrors({
                    form: error.message ?? 'Не удалось отправить код',
                });

                return;
            }

            // TODO:
            // Показать сообщение об успешной отправке.
            // Запустить таймер повторной отправки.
        } finally {
            setIsResending(false);
        }
    };

    return (
        <AuthCard
            title="Введите код"
            description={`Мы отправили код подтверждения на ${email}`}
        >
            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <FormInput
                    type="email"
                    value={email}
                    disabled
                    readOnly
                />

                <FormInput
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="Введите код"
                    type="number"
                    error={errors.otp}
                />

                {errors.form && (
                    <p className="text-sm text-red-500">{errors.form}</p>
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
                >
                    Отправить код повторно
                </LoadingButton>
            </form>
        </AuthCard>
    );
}

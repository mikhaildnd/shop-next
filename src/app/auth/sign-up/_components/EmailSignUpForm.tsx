'use client';

import { useRouter } from 'next/navigation';
import type { SubmitEventHandler} from 'react';
import { useState } from 'react';

import { AuthCard } from '@/app/auth/_components/AuthCard';
import { FormInput } from '@/app/auth/_components/FormInput';
import type { AuthSignUpForm, AuthSignUpFormErrors } from '@/auth/auth.types';
import { authClient } from '@/auth/client';
import { validateEmailRegisterForm } from '@/auth/validation/email-register';
import { LoadingButton } from '@/components/shared/LoadingButton';
import { routes } from '@/lib/routes';

export function EmailSignUpForm() {
    const router = useRouter();

    const [form, setForm] = useState<AuthSignUpForm>({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<AuthSignUpFormErrors>({});
    const [isPending, setIsPending] = useState(false);

    function updateForm<K extends keyof AuthSignUpForm>(
        key: K,
        value: AuthSignUpForm[K],
    ) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [key]: undefined,
            form: undefined,
        }));
    }

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        setErrors({});

        const errors = validateEmailRegisterForm(form);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        setIsPending(true);

        try {
            const { error } = await authClient.signUp.email({
                name: form.name,
                email: form.email,
                password: form.password,
            });

            if (error) {
                setErrors({
                    form: error.message ?? 'Произошла ошибка',
                });

                return;
            }

            const { error: otpError } =
                await authClient.emailOtp.sendVerificationOtp({
                    email: form.email,
                    type: 'email-verification',
                });

            if (otpError) {
                setErrors({
                    form: otpError.message ?? 'Не удалось отправить код',
                });

                return;
            }

            router.push(routes.verifyEmailPage());
        } finally {
            setIsPending(false);
        }
    };

    return (
        <AuthCard
            title="Регистрация"
            description="Введите e-mail, чтобы зарегистрироваться"
        >
            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <FormInput
                    value={form.email}
                    onChange={(event) =>
                        updateForm('email', event.target.value)
                    }
                    placeholder="Введите e-mail"
                    type="email"
                    error={errors.email}
                />
                <FormInput
                    value={form.name}
                    onChange={(event) => updateForm('name', event.target.value)}
                    placeholder="Введите Имя"
                    type="text"
                    error={errors.name}
                />
                <FormInput
                    value={form.password}
                    onChange={(event) =>
                        updateForm('password', event.target.value)
                    }
                    placeholder="Введите пароль"
                    type="password"
                    error={errors.password}
                />
                <FormInput
                    value={form.confirmPassword}
                    onChange={(event) =>
                        updateForm('confirmPassword', event.target.value)
                    }
                    placeholder="Подтвердите пароль"
                    type="password"
                    error={errors.confirmPassword}
                />

                {errors.form && <p className="text-red-500">{errors.form}</p>}

                <LoadingButton
                    type="submit"
                    isLoading={isPending}
                >
                    Зарегистрироваться
                </LoadingButton>
            </form>
        </AuthCard>
    );
}

'use client';

import { useRouter } from 'next/navigation';
import type { SubmitEventHandler} from 'react';
import { useState } from 'react';

import { AuthCard } from '@/app/auth/_components/AuthCard';
import { FormInput } from '@/app/auth/_components/FormInput';
import type { AuthSignInForm, AuthSignInFormErrors } from '@/auth/auth.types';
import { authClient } from '@/auth/client';
import { validateEmailAuthForm } from '@/auth/validation/email-auth';
import { LoadingButton } from '@/components/shared/LoadingButton';
import { routes } from '@/lib/routes';

export function EmailSignInForm() {
    const router = useRouter();

    const [form, setForm] = useState<AuthSignInForm>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<AuthSignInFormErrors>({});
    const [isPending, setIsPending] = useState(false);

    function updateForm<K extends keyof AuthSignInForm>(
        key: K,
        value: AuthSignInForm[K],
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

        const errors = validateEmailAuthForm(form);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        setIsPending(true);

        try {
            const { error } = await authClient.signIn.email({
                email: form.email,
                password: form.password,
            });

            if (error) {
                setErrors({
                    form: error.message ?? 'Произошла ошибка',
                });

                return;
            }

            router.replace(routes.homePage());
            router.refresh();
        } finally {
            setIsPending(false);
        }
    };

    return (
        <AuthCard
            title="Войти"
            description="Введите e-mail, чтобы войти"
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
                    value={form.password}
                    onChange={(event) =>
                        updateForm('password', event.target.value)
                    }
                    placeholder="Введите пароль"
                    type="password"
                    error={errors.password}
                />

                {errors.form && (
                    <p className="text-sm text-red-500">{errors.form}</p>
                )}

                <LoadingButton
                    type="submit"
                    isLoading={isPending}
                >
                    Войти
                </LoadingButton>
            </form>
        </AuthCard>
    );
}

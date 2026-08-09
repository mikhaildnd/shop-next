'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { signIn } from '@/app/auth/sign-in/actions';
import { FormGroup } from '@/components/form/FormGroup';
import { FormInput } from '@/components/form/FormInput';
import { LoadingButton } from '@/components/shared/button/LoadingButton';
import { Label } from '@/components/shared/Label';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { routes } from '@/lib/routes';

export function EmailSignInForm() {
    const [state, formAction, isPending] = useActionState(signIn, {});

    const expiresAt = state.activeRateLimit?.expiresAt;

    const { secondsLeft, isRunning } = useCountdownTimer(expiresAt);

    return (
        <form
            className="flex flex-col gap-4"
            action={formAction}
            noValidate
        >
            <FormGroup error={state.fieldErrors?.email}>
                <Label htmlFor="email">E-mail</Label>
                <FormInput
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={state.values?.email}
                    error={state.fieldErrors?.email}
                />
            </FormGroup>

            <FormGroup
                error={state.fieldErrors?.password}
                className="relative"
            >
                <Label htmlFor="password">Пароль</Label>
                <FormInput
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    error={state.fieldErrors?.password}
                />
                <div className="absolute top-0 right-0 flex justify-center">
                    <p className="text-sm">
                        <Link
                            href={routes.passwordResetPage()}
                            className="focus-ring link-style"
                        >
                            Забыли пароль?
                        </Link>
                    </p>
                </div>
            </FormGroup>

            {state.formError && (
                <p className="text-sm text-red-500">{state.formError}</p>
            )}

            <LoadingButton
                type="submit"
                isLoading={isPending}
                disabled={isPending || isRunning}
            >
                Войти
            </LoadingButton>

            {state.remainingAttempts !== undefined &&
                state.remainingAttempts > 0 && (
                    <p className="text-sm">
                        Осталось попыток: {state.remainingAttempts}
                    </p>
                )}

            {isRunning && (
                <p className="text-sm text-red-500">
                    Повторите попытку через {secondsLeft} сек.
                </p>
            )}
        </form>
    );
}

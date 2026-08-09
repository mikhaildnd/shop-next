'use client';

import { useActionState } from 'react';

import { signUp } from '@/app/auth/sign-up/actions';
import { FormGroup } from '@/components/form/FormGroup';
import { FormInput } from '@/components/form/FormInput';
import { Label } from '@/components/shared/Label';
import { LoadingButton } from '@/components/shared/LoadingButton';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';

export function EmailSignUpForm() {
    const [state, formAction, isPending] = useActionState(signUp, {});

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

            <FormGroup error={state.fieldErrors?.name}>
                <Label htmlFor="name">Имя</Label>
                <FormInput
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    error={state.fieldErrors?.name}
                />
            </FormGroup>

            <FormGroup error={state.fieldErrors?.password}>
                <Label htmlFor="password">Пароль</Label>
                <FormInput
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    error={state.fieldErrors?.password}
                />
            </FormGroup>

            <FormGroup error={state.fieldErrors?.confirmPassword}>
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <FormInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    error={state.fieldErrors?.confirmPassword}
                />
            </FormGroup>

            {state.formError && (
                <p className="text-red-500">{state.formError}</p>
            )}

            <LoadingButton
                type="submit"
                isLoading={isPending}
                disabled={isPending || isRunning}
            >
                Зарегистрироваться
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

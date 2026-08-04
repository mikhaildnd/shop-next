'use client';

import { useActionState, useEffect } from 'react';

import { FormGroup } from '@/app/auth/_components/FormGroup';
import { FormInput } from '@/app/auth/_components/FormInput';
import { signUp } from '@/app/auth/sign-up/actions';
import { AUTH_FORM_FIELDS } from '@/auth/auth.consts';
import { Label } from '@/components/shared/Label';
import { LoadingButton } from '@/components/shared/LoadingButton';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';

export function EmailSignUpForm() {
    const [state, formAction, isPending] = useActionState(signUp, {});

    const { restart, secondsLeft } = useCountdownTimer();

    const canResend = secondsLeft === 0;

    const retryAfterSeconds = state.retryAfterSeconds;

    useEffect(() => {
        if (retryAfterSeconds === undefined || retryAfterSeconds <= 0) {
            return;
        }

        restart(retryAfterSeconds);
    }, [retryAfterSeconds, restart]);

    return (
        <form
            className="flex flex-col gap-4"
            action={formAction}
            noValidate
        >
            <FormGroup error={state.fieldErrors?.email}>
                <Label htmlFor={AUTH_FORM_FIELDS.email}>E-mail</Label>
                <FormInput
                    id={AUTH_FORM_FIELDS.email}
                    name={AUTH_FORM_FIELDS.email}
                    type="email"
                    autoComplete="email"
                    defaultValue={state.values?.email}
                    error={state.fieldErrors?.email}
                />
            </FormGroup>

            <FormGroup error={state.fieldErrors?.name}>
                <Label htmlFor={AUTH_FORM_FIELDS.name}>Имя</Label>
                <FormInput
                    id={AUTH_FORM_FIELDS.name}
                    name={AUTH_FORM_FIELDS.name}
                    type="text"
                    autoComplete="name"
                    error={state.fieldErrors?.name}
                />
            </FormGroup>

            <FormGroup error={state.fieldErrors?.password}>
                <Label htmlFor={AUTH_FORM_FIELDS.password}>Пароль</Label>
                <FormInput
                    id={AUTH_FORM_FIELDS.password}
                    name={AUTH_FORM_FIELDS.password}
                    type="password"
                    autoComplete="current-password"
                    error={state.fieldErrors?.password}
                />
            </FormGroup>

            <FormGroup error={state.fieldErrors?.confirmPassword}>
                <Label htmlFor={AUTH_FORM_FIELDS.confirmPassword}>
                    Подтвердите пароль
                </Label>
                <FormInput
                    id={AUTH_FORM_FIELDS.confirmPassword}
                    name={AUTH_FORM_FIELDS.confirmPassword}
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
                disabled={isPending || !canResend}
            >
                Зарегистрироваться
            </LoadingButton>

            {!canResend && (
                <p className="text-muted-foreground text-sm">
                    Повторная отправка через {secondsLeft} сек.
                </p>
            )}
        </form>
    );
}

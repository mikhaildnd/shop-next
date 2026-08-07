'use client';

import { useActionState } from 'react';

import { FormGroup } from '@/app/auth/_components/FormGroup';
import { FormInput } from '@/app/auth/_components/FormInput';
import { signUp } from '@/app/auth/sign-up/actions';
import { AUTH_FORM_FIELDS } from '@/auth/auth.consts';
import { Label } from '@/components/shared/Label';
import { LoadingButton } from '@/components/shared/LoadingButton';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';

export function EmailSignUpForm() {
    const [state, formAction, isPending] = useActionState(signUp, {});

    const retryAfterSeconds = state.rateLimit?.retryAfterSeconds ?? 0;

    const { secondsLeft } = useCountdownTimer(retryAfterSeconds);

    const hasRateLimit = secondsLeft > 0;

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
                disabled={isPending || hasRateLimit}
            >
                Зарегистрироваться
            </LoadingButton>

            {hasRateLimit && (
                <p className="text-sm text-red-500">
                    Повторите попытку через {secondsLeft} сек.
                </p>
            )}
        </form>
    );
}

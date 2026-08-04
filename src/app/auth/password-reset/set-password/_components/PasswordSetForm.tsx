'use client';

import { useActionState } from 'react';

import { FormGroup } from '@/app/auth/_components/FormGroup';
import { FormInput } from '@/app/auth/_components/FormInput';
import { setPassword } from '@/app/auth/password-reset/set-password/actions';
import { AUTH_FORM_FIELDS } from '@/auth/auth.consts';
import { Label } from '@/components/shared/Label';
import { LoadingButton } from '@/components/shared/LoadingButton';

export function PasswordSetForm() {
    const [state, formAction, isPending] = useActionState(setPassword, {});

    return (
        <form
            className="flex flex-col gap-4"
            action={formAction}
            noValidate
        >
            <FormGroup error={state.fieldErrors?.password}>
                <Label htmlFor={AUTH_FORM_FIELDS.password}>
                    Введите новый пароль
                </Label>
                <FormInput
                    id={AUTH_FORM_FIELDS.password}
                    name={AUTH_FORM_FIELDS.password}
                    type="password"
                    autoComplete="new-password"
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
                <p className="text-sm text-red-500">{state.formError}</p>
            )}

            <LoadingButton
                type="submit"
                isLoading={isPending}
            >
                Сохранить пароль
            </LoadingButton>
        </form>
    );
}

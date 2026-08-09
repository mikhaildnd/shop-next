'use client';

import { useActionState } from 'react';

import { setPassword } from '@/app/auth/password-reset/set-password/actions';
import { FormGroup } from '@/components/form/FormGroup';
import { FormInput } from '@/components/form/FormInput';
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
                <Label htmlFor="password">Введите новый пароль</Label>
                <FormInput
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
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
                <p className="text-sm text-red-500">{state.formError}</p>
            )}

            <LoadingButton
                type="submit"
                isLoading={isPending}
                disabled={isPending}
            >
                Сохранить пароль
            </LoadingButton>
        </form>
    );
}

'use client';

import { useActionState } from 'react';

import { FormGroup } from '@/app/auth/_components/FormGroup';
import { FormInput } from '@/app/auth/_components/FormInput';
import { requestPasswordReset } from '@/app/auth/password-reset/actions';
import { AUTH_FORM_FIELDS } from '@/auth/auth.consts';
import { Label } from '@/components/shared/Label';
import { LoadingButton } from '@/components/shared/LoadingButton';

export function PasswordResetForm() {
    const [state, formAction, isPending] = useActionState(
        requestPasswordReset,
        {},
    );

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

            {state.formError && (
                <p className="text-sm text-red-500">{state.formError}</p>
            )}

            <LoadingButton
                type="submit"
                isLoading={isPending}
            >
                Отправить код для сброса пароля
            </LoadingButton>
        </form>
    );
}

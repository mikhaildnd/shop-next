'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { FormGroup } from '@/app/auth/_components/FormGroup';
import { FormInput } from '@/app/auth/_components/FormInput';
import { signIn } from '@/app/auth/sign-in/actions';
import { AUTH_FORM_FIELDS } from '@/auth/auth.consts';
import { Label } from '@/components/shared/Label';
import { LoadingButton } from '@/components/shared/LoadingButton';
import { routes } from '@/lib/routes';

export function EmailSignInForm() {
    const [state, formAction, isPending] = useActionState(signIn, {});

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

            <FormGroup
                error={state.fieldErrors?.password}
                className="relative"
            >
                <Label htmlFor={AUTH_FORM_FIELDS.password}>Пароль</Label>
                <FormInput
                    id={AUTH_FORM_FIELDS.password}
                    name={AUTH_FORM_FIELDS.password}
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
            >
                Войти
            </LoadingButton>
        </form>
    );
}

'use client';

import { useActionState, useEffect } from 'react';

import { changePassword } from '@/app/(shop)/profile/actions';
import { FormGroup } from '@/components/form/FormGroup';
import { FormInput } from '@/components/form/FormInput';
import { LoadingButton } from '@/components/shared/button/LoadingButton';
import { Label } from '@/components/shared/Label';

interface ChangeUserPasswordFormProps {
    onSuccess: () => void;
}

export function ChangeUserPasswordForm({
    onSuccess,
}: ChangeUserPasswordFormProps) {
    const [state, formAction, isPending] = useActionState(changePassword, {});

    useEffect(() => {
        if (!state.success) {
            return;
        }

        onSuccess();
    }, [state.success, onSuccess]);

    return (
        <form
            className="flex flex-col gap-4"
            action={formAction}
            noValidate
        >
            <FormGroup error={state.fieldErrors?.currentPassword}>
                <Label htmlFor="currentPassword">Текущий пароль</Label>
                <FormInput
                    className="max-w-100"
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    error={state.fieldErrors?.currentPassword}
                />
            </FormGroup>

            <FormGroup error={state.fieldErrors?.newPassword}>
                <Label htmlFor="newPassword">Новый пароль</Label>
                <FormInput
                    className="max-w-100"
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    error={state.fieldErrors?.newPassword}
                />
            </FormGroup>

            <FormGroup error={state.fieldErrors?.confirmNewPassword}>
                <Label htmlFor="confirmNewPassword">
                    Подтвердите новый пароль
                </Label>
                <FormInput
                    className="max-w-100"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    autoComplete="new-password"
                    error={state.fieldErrors?.confirmNewPassword}
                />
            </FormGroup>

            {state.formError && (
                <p className="text-red-500">{state.formError}</p>
            )}

            <LoadingButton
                size="sm"
                variant="outline"
                className="min-w-20 self-start"
                type="submit"
                isLoading={isPending}
                disabled={isPending}
            >
                Изменить
            </LoadingButton>
        </form>
    );
}

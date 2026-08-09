'use client';

import { useActionState } from 'react';

import { requestChangeEmail } from '@/app/auth/change-email/actions';
import { FormGroup } from '@/components/form/FormGroup';
import { FormInput } from '@/components/form/FormInput';
import { LoadingButton } from '@/components/shared/button/LoadingButton';
import { Label } from '@/components/shared/Label';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';

interface ChangeEmailFormProps {
    expiresAt?: number;
}

export function ChangeEmailForm({
    expiresAt: initialExpiresAt,
}: ChangeEmailFormProps) {
    const [state, formAction, isPending] = useActionState(
        requestChangeEmail,
        {},
    );

    const expiresAt = state.activeRateLimit?.expiresAt ?? initialExpiresAt;

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

            {state.formError && (
                <p className="text-sm text-red-500">{state.formError}</p>
            )}

            <LoadingButton
                type="submit"
                isLoading={isPending}
                disabled={isPending || isRunning}
            >
                Сменить
            </LoadingButton>

            {isRunning && (
                <p className="text-sm text-red-500">
                    Повторите попытку через {secondsLeft} сек.
                </p>
            )}
        </form>
    );
}

'use client';

import { useActionState } from 'react';

import { requestChangeEmail } from '@/app/(shop)/profile/change-email/actions';
import { PROFILE_FORM_FIELDS } from '@/app/(shop)/profile/profile.consts';
import { FormGroup } from '@/app/auth/_components/FormGroup';
import { FormInput } from '@/app/auth/_components/FormInput';
import { Label } from '@/components/shared/Label';
import { LoadingButton } from '@/components/shared/LoadingButton';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';

export function ChangeEmailForm() {
    const [state, formAction, isPending] = useActionState(
        requestChangeEmail,
        {},
    );

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
                <Label htmlFor={PROFILE_FORM_FIELDS.email}>E-mail</Label>
                <FormInput
                    id={PROFILE_FORM_FIELDS.email}
                    name={PROFILE_FORM_FIELDS.email}
                    type="email"
                    autoComplete="email"
                    defaultValue={state.values?.email}
                    error={state.fieldErrors?.email}
                />
            </FormGroup>

            {hasRateLimit && (
                <p className="text-sm text-red-500">
                    Повторите попытку через {secondsLeft} сек.
                </p>
            )}

            {state.formError && (
                <p className="text-sm text-red-500">{state.formError}</p>
            )}

            <LoadingButton
                type="submit"
                isLoading={isPending}
                disabled={isPending || hasRateLimit}
            >
                Сменить
            </LoadingButton>
        </form>
    );
}

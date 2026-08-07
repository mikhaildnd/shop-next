'use client';

import { useActionState, useEffect } from 'react';

import { changeName } from '@/app/(shop)/profile/actions';
import { PROFILE_FORM_FIELDS } from '@/app/(shop)/profile/profile.consts';
import { FormGroup } from '@/app/auth/_components/FormGroup';
import { FormInput } from '@/app/auth/_components/FormInput';
import { Label } from '@/components/shared/Label';
import { LoadingButton } from '@/components/shared/LoadingButton';

interface UpdateUserNameFormProps {
    defaultValue: string;
    onSuccess: () => void;
}

export function UpdateUserNameForm({
    onSuccess,
    defaultValue,
}: UpdateUserNameFormProps) {
    const [state, formAction, isPending] = useActionState(changeName, {});

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
            <FormGroup error={state.fieldErrors?.name}>
                <Label htmlFor={PROFILE_FORM_FIELDS.name}>Новое имя</Label>
                <FormInput
                    className="max-w-100"
                    id={PROFILE_FORM_FIELDS.name}
                    name={PROFILE_FORM_FIELDS.name}
                    type="text"
                    autoComplete="name"
                    defaultValue={state.values?.name ?? defaultValue}
                    error={state.fieldErrors?.name}
                />
            </FormGroup>

            {state.formError && (
                <p className="text-red-500">{state.formError}</p>
            )}

            <LoadingButton
                size="sm"
                variant="secondary"
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

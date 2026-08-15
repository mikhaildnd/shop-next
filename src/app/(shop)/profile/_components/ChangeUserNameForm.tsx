'use client';

import { useActionState, useEffect } from 'react';

import { changeName } from '@/app/(shop)/profile/actions';
import { LoadingButton } from '@/components/button/LoadingButton';
import { FormGroup } from '@/components/form/FormGroup';
import { FormInput } from '@/components/form/FormInput';
import { Label } from '@/components/form/Label';

interface ChangeUserNameFormProps {
    onSuccess: () => void;
}

export function ChangeUserNameForm({ onSuccess }: ChangeUserNameFormProps) {
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
                <Label htmlFor="name">Новое имя</Label>
                <FormInput
                    className="max-w-100"
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    error={state.fieldErrors?.name}
                />
            </FormGroup>

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

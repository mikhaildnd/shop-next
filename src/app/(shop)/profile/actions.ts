'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { PROFILE_FORM_FIELDS } from '@/app/(shop)/profile/profile.consts';
import type {
    ChangeNameForm,
    ChangeNameFormErrors,
} from '@/app/(shop)/profile/profile.types';
import { validateChangeNameForm } from '@/app/(shop)/profile/validation/user-name';
import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';
import { updateUserName } from '@/services/user/user.service';

interface ChangeNameState {
    success?: boolean;
    formError?: string;
    fieldErrors?: ChangeNameFormErrors;
    values?: ChangeNameForm;
}

export async function changeName(
    _: ChangeNameState,
    formData: FormData,
): Promise<ChangeNameState> {
    const session = await getSession();

    if (!session) {
        redirect(routes.signInPage());
    }

    const form = {
        name: String(formData.get(PROFILE_FORM_FIELDS.name) ?? ''),
    };

    const fieldErrors = validateChangeNameForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
            values: form,
        };
    }

    try {
        await updateUserName(session.user.id, form.name);

        revalidatePath(routes.profilePage());

        return { success: true };
    } catch {
        return {
            formError: 'Не удалось обновить имя.',
            values: form,
        };
    }
}

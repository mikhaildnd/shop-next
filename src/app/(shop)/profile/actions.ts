'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { PROFILE_FORM_FIELDS } from '@/app/(shop)/profile/profile.consts';
import type {
    UpdateNameForm,
    UpdateNameFormErrors,
} from '@/app/(shop)/profile/profile.types';
import { validateUpdateNameForm } from '@/app/(shop)/profile/validation/user-name';
import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';
import { updateUserName } from '@/services/user/user.service';

export interface UpdateNameState {
    success?: boolean;
    formError?: string;
    fieldErrors?: UpdateNameFormErrors;
    values?: UpdateNameForm;
}

export async function updateName(
    _: UpdateNameState,
    formData: FormData,
): Promise<UpdateNameState> {
    const session = await getSession();

    if (!session) {
        redirect(routes.signInPage());
    }

    const form = {
        name: String(formData.get(PROFILE_FORM_FIELDS.name) ?? ''),
    };

    const fieldErrors = validateUpdateNameForm(form);

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

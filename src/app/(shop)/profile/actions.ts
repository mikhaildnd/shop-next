'use server';

import { isAPIError } from 'better-auth/api';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { validateChangeNameForm } from '@/app/(shop)/profile/form-validators/change-name';
import { validateChangePasswordForm } from '@/app/(shop)/profile/form-validators/change-password';
import type {
    ChangeNameForm,
    ChangeNameFormErrors,
    ChangePasswordForm,
    ChangePasswordFormErrors,
} from '@/app/(shop)/profile/profile.types';
import { auth } from '@/auth/auth';
import { translateAuthError } from '@/auth/errors/translate-auth-error';
import { requireSession } from '@/auth/session';
import { routes } from '@/lib/routes';
import { changeUserName } from '@/services/user/user.service';

interface ChangeNameState {
    success?: boolean;
    fieldErrors?: ChangeNameFormErrors;
}

export async function changeName(
    _: ChangeNameState,
    formData: FormData,
): Promise<ChangeNameState> {
    const session = await requireSession();

    const form: ChangeNameForm = {
        name: String(formData.get('name') ?? ''),
    };

    const fieldErrors: ChangeNameFormErrors = validateChangeNameForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
        };
    }

    await changeUserName(session.user.id, form.name);

    revalidatePath(routes.profilePage());

    return { success: true };
}

interface ChangePasswordState {
    success?: boolean;
    formError?: string;
    fieldErrors?: ChangePasswordFormErrors;
}

export async function changePassword(
    _: ChangePasswordState,
    formData: FormData,
): Promise<ChangePasswordState> {
    await requireSession();

    const form: ChangePasswordForm = {
        currentPassword: String(formData.get('currentPassword') ?? ''),
        newPassword: String(formData.get('newPassword') ?? ''),
        confirmNewPassword: String(formData.get('confirmNewPassword') ?? ''),
    };

    const fieldErrors: ChangePasswordFormErrors =
        validateChangePasswordForm(form);

    if (Object.keys(fieldErrors).length > 0) {
        return {
            fieldErrors,
        };
    }

    try {
        await auth.api.changePassword({
            body: {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
                revokeOtherSessions: false,
            },

            headers: await headers(),
        });

        return { success: true };
    } catch (error) {
        if (isAPIError(error)) {
            return {
                formError: translateAuthError(error),
            };
        }

        throw error;
    }
}

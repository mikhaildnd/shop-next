import type {
    ChangePasswordForm,
    ChangePasswordFormErrors,
} from '@/app/(shop)/profile/profile.types';
import { validateConfirmPassword } from '@/services/user/validatiors/validate-confirm-password';
import { validateCurrentPassword } from '@/services/user/validatiors/validate-current-password';
import { validatePassword } from '@/services/user/validatiors/validate-password';

export function validateChangePasswordForm(
    form: ChangePasswordForm,
): ChangePasswordFormErrors {
    const errors: ChangePasswordFormErrors = {};

    const currentPasswordError = validateCurrentPassword(form.currentPassword);
    const newPasswordError = validatePassword(form.newPassword);
    const confirmNewPasswordError = validateConfirmPassword(
        form.newPassword,
        form.confirmNewPassword,
    );

    if (currentPasswordError) {
        errors.currentPassword = currentPasswordError;
    }

    if (newPasswordError) {
        errors.newPassword = newPasswordError;
    }

    if (confirmNewPasswordError) {
        errors.confirmNewPassword = confirmNewPasswordError;
    }

    return errors;
}

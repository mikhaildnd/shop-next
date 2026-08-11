import type {
    AuthPasswordSetForm,
    AuthPasswordSetFormErrors,
} from '@/auth/auth.types';
import { validateConfirmPassword } from '@/services/user/validatiors/validate-confirm-password';
import { validatePassword } from '@/services/user/validatiors/validate-password';

export function validateSetPasswordForm(
    form: AuthPasswordSetForm,
): AuthPasswordSetFormErrors {
    const errors: AuthPasswordSetFormErrors = {};

    const passwordError = validatePassword(form.password);
    const confirmPasswordError = validateConfirmPassword(
        form.password,
        form.confirmPassword,
    );

    if (passwordError) {
        errors.password = passwordError;
    }

    if (confirmPasswordError) {
        errors.confirmPassword = confirmPasswordError;
    }

    return errors;
}

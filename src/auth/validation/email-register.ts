import type { AuthSignUpForm, AuthSignUpFormErrors } from '@/auth/auth.types';
import { validateConfirmPassword } from '@/services/user/validation/validate-confirm-password';
import { validateEmail } from '@/services/user/validation/validate-email';
import { validateName } from '@/services/user/validation/validate-name';
import { validatePassword } from '@/services/user/validation/validate-password';

export function validateEmailRegisterForm(
    form: AuthSignUpForm,
): AuthSignUpFormErrors {
    const errors: AuthSignUpFormErrors = {};

    const emailError = validateEmail(form.email);
    const nameError = validateName(form.name);
    const passwordError = validatePassword(form.password);
    const confirmPasswordError = validateConfirmPassword(
        form.password,
        form.confirmPassword,
    );

    if (emailError) {
        errors.email = emailError;
    }

    if (nameError) {
        errors.name = nameError;
    }

    if (passwordError) {
        errors.password = passwordError;
    }

    if (confirmPasswordError) {
        errors.confirmPassword = confirmPasswordError;
    }

    return errors;
}

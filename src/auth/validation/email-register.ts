import type { AuthSignUpForm, AuthSignUpFormErrors } from '@/auth/auth.types';
import { validateConfirmPassword } from '@/auth/validation/fields/validate-confirm-password';
import { validateEmail } from '@/auth/validation/fields/validate-email';
import { validateName } from '@/auth/validation/fields/validate-name';
import { validatePassword } from '@/auth/validation/fields/validate-password';

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

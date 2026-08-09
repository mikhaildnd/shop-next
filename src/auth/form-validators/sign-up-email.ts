import type { AuthSignUpForm, AuthSignUpFormErrors } from '@/auth/auth.types';
import { validateConfirmPassword } from '@/services/user/validatiors/validate-confirm-password';
import { validateEmail } from '@/services/user/validatiors/validate-email';
import { validateName } from '@/services/user/validatiors/validate-name';
import { validatePassword } from '@/services/user/validatiors/validate-password';

export function validateSignUpEmailForm(
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

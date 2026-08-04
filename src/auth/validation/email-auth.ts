import type { AuthSignInForm, AuthSignInFormErrors } from '@/auth/auth.types';
import { validateEmail } from '@/auth/validation/fields/validate-email';
import { validatePassword } from '@/auth/validation/fields/validate-password';

export function validateEmailAuthForm(
    form: AuthSignInForm,
): AuthSignInFormErrors {
    const errors: AuthSignInFormErrors = {};

    const emailError = validateEmail(form.email);

    if (emailError) {
        errors.email = emailError;
    }

    const passwordError = validatePassword(form.password);

    if (passwordError) {
        errors.password = passwordError;
    }

    return errors;
}

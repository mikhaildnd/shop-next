import type { AuthSignInForm, AuthSignInFormErrors } from '@/auth/auth.types';
import { validateEmail } from '@/services/user/validatiors/validate-email';
import { validatePassword } from '@/services/user/validatiors/validate-password';

export function validateSignInEmailForm(
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

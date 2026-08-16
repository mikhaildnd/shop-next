import type {
    AuthPasswordResetForm,
    AuthPasswordResetFormErrors,
} from '@/auth/auth.types';
import { validateEmail } from '@/services/user/validators/validate-email';

export function validatePasswordResetForm(
    form: AuthPasswordResetForm,
): AuthPasswordResetFormErrors {
    const errors: AuthPasswordResetFormErrors = {};

    const emailError = validateEmail(form.email);

    if (emailError) {
        errors.email = emailError;
    }

    return errors;
}

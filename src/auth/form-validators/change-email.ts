import type { ChangeEmailForm, ChangeEmailFormErrors } from '@/auth/auth.types';
import { validateEmail } from '@/services/user/validatiors/validate-email';

export function validateChangeEmailForm(
    form: ChangeEmailForm,
): ChangeEmailFormErrors {
    const errors: ChangeEmailFormErrors = {};

    const emailError = validateEmail(form.email);

    if (emailError) {
        errors.email = emailError;
    }

    return errors;
}

import type {
    ChangeEmailForm,
    ChangeEmailFormErrors,
} from '@/app/(shop)/profile/profile.types';
import { validateEmail } from '@/services/user/validation/validate-email';

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

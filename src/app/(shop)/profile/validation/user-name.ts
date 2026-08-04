import type {
    UpdateNameForm,
    UpdateNameFormErrors,
} from '@/app/(shop)/profile/profile.types';
import { validateName } from '@/services/user/validation/validate-name';

export function validateUpdateNameForm(
    form: UpdateNameForm,
): UpdateNameFormErrors {
    const errors: UpdateNameFormErrors = {};

    const nameError = validateName(form.name);

    if (nameError) {
        errors.name = nameError;
    }

    return errors;
}

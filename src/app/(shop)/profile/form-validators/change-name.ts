import type {
    ChangeNameForm,
    ChangeNameFormErrors,
} from '@/app/(shop)/profile/profile.types';
import { validateName } from '@/services/user/validatiors/validate-name';

export function validateChangeNameForm(
    form: ChangeNameForm,
): ChangeNameFormErrors {
    const errors: ChangeNameFormErrors = {};

    const nameError = validateName(form.name);

    if (nameError) {
        errors.name = nameError;
    }

    return errors;
}

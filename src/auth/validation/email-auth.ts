import type { AuthForm, AuthFormErrors } from '@/auth/auth.types';
import { EMAIL_REGEX } from '@/auth/validation/validation.consts';

type EmailAuthForm = Pick<AuthForm, 'email' | 'password'>;

export function validateEmailAuthForm(form: EmailAuthForm): AuthFormErrors {
    const errors: AuthFormErrors = {};

    if (!form.email) {
        errors.email = 'Введите e-mail';
    } else if (!EMAIL_REGEX.test(form.email)) {
        errors.email = 'Введите корректный e-mail';
    }

    if (!form.password) {
        errors.password = 'Введите пароль';
    }

    if (form.password.length < 8) {
        errors.password = 'Пароль должен содержать минимум 8 символов';
    }

    return errors;
}

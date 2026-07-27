import type { AuthForm, AuthFormErrors } from '@/auth/auth.types';

type EmailOtpForm = Pick<AuthForm, 'otp'>;

export function validateEmailOtpForm(form: EmailOtpForm): AuthFormErrors {
    const errors: AuthFormErrors = {};

    if (!form.otp) {
        errors.otp = 'Введите код';
        return errors;
    }

    if (!/^\d{6}$/.test(form.otp)) {
        errors.otp = 'Введите шестизначный код';
    }

    return errors;
}

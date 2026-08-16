import { EMAIL_REGEX } from '@/auth/auth.constants';

export function validateEmail(email: string): string | undefined {
    if (!email) {
        return 'Введите e-mail';
    }

    if (!EMAIL_REGEX.test(email)) {
        return 'Введите корректный e-mail';
    }
}

import { PASSWORD_LENGTH } from '@/auth/auth.constants';

export function validatePassword(password: string): string | undefined {
    if (!password) {
        return 'Введите пароль';
    }

    if (password.length < PASSWORD_LENGTH) {
        return `Пароль должен содержать минимум ${PASSWORD_LENGTH} символов`;
    }
}

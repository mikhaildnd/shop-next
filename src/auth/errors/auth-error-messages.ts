import { AUTH_ERROR_CODES } from '@/auth/errors/auth-error-codes';

export const AUTH_ERROR_MESSAGES = new Map<string, string>([
    [
        AUTH_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD.code,
        'Неверный e-mail или пароль',
    ],
    [
        AUTH_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL.code,
        'Пользователь с таким e-mail уже зарегистрирован',
    ],
    [
        AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED.code,
        'Этот e-mail еще не подтвержден. Подтвердите e-mail и попробуйте войти заново',
    ],
    [
        AUTH_ERROR_CODES.OTP_EXPIRED.code,
        'Срок действия кода истёк. Запросите новый код',
    ],
    [AUTH_ERROR_CODES.INVALID_OTP.code, 'Неверный код'],
    [
        AUTH_ERROR_CODES.TOO_MANY_ATTEMPTS.code,
        'Превышено количество попыток. Запросите новый код',
    ],
    [
        AUTH_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL.code,
        'Пользователь с таким e-mail существует. Используйте другой e-mail.',
    ],
    [AUTH_ERROR_CODES.USER_ALREADY_EXISTS.code, 'Пользователь уже существует.'],
]);

export const DEFAULT_AUTH_ERROR_MESSAGE =
    'Произошла ошибка. Попробуйте ещё раз';

export const UNHANDLED_AUTH_ERROR_MESSAGE = 'Unhandled Better Auth error:';

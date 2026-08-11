export const AUTH_ERROR_TRANSLATIONS: Record<string, string> = {
    // Authentication
    INVALID_EMAIL_OR_PASSWORD: 'Неверный e-mail или пароль',
    INVALID_PASSWORD: 'Неверный пароль',
    EMAIL_NOT_VERIFIED:
        'Этот e-mail еще не подтвержден. Подтвердите e-mail и попробуйте войти заново',
    UNAUTHORIZED: 'Необходимо авторизоваться',

    // Registration
    USER_ALREADY_EXISTS: 'Пользователь уже существует.',
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
        'Пользователь с таким e-mail уже зарегистрирован',

    // OTP
    INVALID_OTP: 'Неверный код',
    OTP_EXPIRED: 'Срок действия кода истёк. Запросите новый код',
    TOO_MANY_ATTEMPTS: 'Превышено количество попыток. Запросите новый код',
} satisfies Record<string, string>;

export const DEFAULT_AUTH_ERROR_MESSAGE =
    'Произошла ошибка. Попробуйте ещё раз';

export const UNHANDLED_AUTH_ERROR_MESSAGE = 'Unhandled Better Auth error:';

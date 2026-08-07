export const AUTH_FORM_FIELDS = {
    email: 'email',
    name: 'name',
    password: 'password',
    confirmPassword: 'confirmPassword',
    otp: 'otp',
} as const;

export const SIGN_UP_ATTEMPTS = 2;
export const SIGN_UP_TIMEOUT_SECONDS = 40;

export const SIGN_IN_ATTEMPTS = 2;
export const SIGN_IN_TIMEOUT_SECONDS = 40;

export const EMAIL_CHANGE_TIMEOUT_SECONDS = 40;
export const EMAIL_CHANGE_ATTEMPTS = 2;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const OTP_LENGTH = 6;
export const OTP_EXPIRES_IN = 60 * 15;
export const OTP_REGEXP = new RegExp(`^\\d{${OTP_LENGTH}}$`);

export const PASSWORD_LENGTH = 8;
export const NAME_MAX_LENGTH = 24;
export const NAME_MIN_LENGTH = 2;

export const PASSWORD_RESET_ATTEMPTS = 2;
export const PASSWORD_RESET_TIMEOUT_SECONDS = 40;

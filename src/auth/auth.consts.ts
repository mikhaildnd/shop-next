export const AUTH_FORM_FIELDS = {
    email: 'email',
    name: 'name',
    password: 'password',
    confirmPassword: 'confirmPassword',
    otp: 'otp',
} as const;

export const OTP_LENGTH = 6;
export const OTP_EXPIRES_IN = 60 * 15;
export const OTP_RESEND_TIMEOUT_SECONDS = 60;
export const OTP_REGEXP = new RegExp(`^\\d{${OTP_LENGTH}}$`);

export const PASSWORD_LENGTH = 8;
export const NAME_MAX_LENGTH = 24;
export const NAME_MIN_LENGTH = 2;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

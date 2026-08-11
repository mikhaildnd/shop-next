export type EmailOtpType =
    | 'email-verification'
    | 'sign-in'
    | 'forget-password'
    | 'change-email';

export type SendEmailOtpParams = {
    email: string;
    otp: string;
    type: EmailOtpType;
};

import type { FormErrors } from '@/lib/types/form-errors';

export type AuthPasswordSetForm = {
    password: string;
    confirmPassword: string;
};
export type AuthPasswordSetFormErrors = FormErrors<AuthPasswordSetForm>;

export type AuthPasswordResetForm = {
    email: string;
};
export type AuthPasswordResetFormErrors = FormErrors<AuthPasswordResetForm>;

export type AuthSignInForm = {
    email: string;
    password: string;
};
export type AuthSignInFormErrors = FormErrors<AuthSignInForm>;

export type AuthSignUpForm = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};
export type AuthSignUpFormErrors = FormErrors<AuthSignUpForm>;

export type AuthOtpForm = {
    otp: string;
};
export type AuthOtpFormErrors = FormErrors<AuthOtpForm>;

export type ChangeEmailForm = {
    email: string;
};
export type ChangeEmailFormErrors = FormErrors<ChangeEmailForm>;

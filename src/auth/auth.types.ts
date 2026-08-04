import type { FormErrors } from '@/lib/types/form-errors';
import type { UserFormFields } from '@/services/user/user-form.types';

// Password set form
export type AuthPasswordSetForm = Pick<
    UserFormFields,
    'password' | 'confirmPassword'
>;
export type AuthPasswordSetFormErrors = FormErrors<AuthPasswordSetForm>;

// Password reset form
export type AuthPasswordResetForm = Pick<UserFormFields, 'email'>;
export type AuthPasswordResetFormErrors = FormErrors<AuthPasswordResetForm>;

// Sign in form
export type AuthSignInForm = Pick<UserFormFields, 'email' | 'password'>;
export type AuthSignInFormErrors = FormErrors<AuthSignInForm>;

// Sign up form
export type AuthSignUpForm = Pick<
    UserFormFields,
    'name' | 'email' | 'password' | 'confirmPassword'
>;
export type AuthSignUpFormErrors = FormErrors<AuthSignUpForm>;

// Otp form
export type AuthOtpForm = Pick<UserFormFields, 'otp'>;
export type AuthOtpFormErrors = FormErrors<AuthOtpForm>;

// Auth fields

export interface AuthFields {
    email: string;
    phone: string;
    name: string;
    password: string;
    confirmPassword: string;
    otp: string;
}

export type AuthFieldsErrors = {
    [K in keyof AuthFields]?: string;
};

// Password set form
export type AuthPasswordSetForm = Pick<
    AuthFields,
    'password' | 'confirmPassword'
>;

export type AuthPasswordSetFormErrors = Pick<
    AuthFieldsErrors,
    'password' | 'confirmPassword'
>;

// Password reset form
export type AuthPasswordResetForm = Pick<AuthFields, 'email'>;
export type AuthPasswordResetFormErrors = Pick<AuthFieldsErrors, 'email'>;

// Sign in form
export type AuthSignInForm = Pick<AuthFields, 'email' | 'password'>;
export type AuthSignInFormErrors = Pick<AuthFieldsErrors, 'email' | 'password'>;

// Sign up form
export type AuthSignUpForm = Pick<
    AuthFields,
    'name' | 'email' | 'password' | 'confirmPassword'
>;
export type AuthSignUpFormErrors = Pick<
    AuthFieldsErrors,
    'name' | 'email' | 'password' | 'confirmPassword'
>;

// Otp form
export type AuthOtpForm = Pick<AuthFields, 'otp'>;
export type AuthOtpFormErrors = Pick<AuthFieldsErrors, 'otp'>;

export interface AuthForm {
    email: string;
    phone: string;
    name: string;
    password: string;
    confirmPassword: string;
    otp: string;
}

export type AuthSignInForm = Pick<AuthForm, 'email' | 'password'>;

export type AuthSignUpForm = Pick<
    AuthForm,
    'name' | 'email' | 'password' | 'confirmPassword'
>;

export type AuthVerifyEmailForm = Pick<AuthForm, 'otp'>;

export type AuthFormErrors = {
    email?: string;
    phone?: string;
    name?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
    otp?: string;
};

export type AuthSignInFormErrors = Pick<
    AuthFormErrors,
    'email' | 'password' | 'form'
>;

export type AuthSignUpFormErrors = Pick<
    AuthFormErrors,
    'name' | 'email' | 'password' | 'confirmPassword' | 'form'
>;

export type AuthVerifyEmailFormErrors = Pick<AuthFormErrors, 'otp' | 'form'>;

import type { FormErrors } from '@/lib/types/form-errors';

export type ChangeNameForm = { name: string };
export type ChangeNameFormErrors = FormErrors<ChangeNameForm>;

export type ChangePasswordForm = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};
export type ChangePasswordFormErrors = FormErrors<ChangePasswordForm>;

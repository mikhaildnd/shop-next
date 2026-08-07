import type { FormErrors } from '@/lib/types/form-errors';
import type { UserFormFields } from '@/services/user/user-form.types';

export type ChangeNameForm = Pick<UserFormFields, 'name'>;
export type ChangeNameFormErrors = FormErrors<ChangeNameForm>;

export type ChangeEmailForm = Pick<UserFormFields, 'email'>;
export type ChangeEmailFormErrors = FormErrors<ChangeEmailForm>;

export type ChangeEmailOtpForm = Pick<UserFormFields, 'otp'>;
export type ChangeEmailOtpFormErrors = FormErrors<ChangeEmailOtpForm>;

import type { FormErrors } from '@/lib/types/form-errors';
import type { UserFormFields } from '@/services/user/user-form.types';

export type UpdateNameForm = Pick<UserFormFields, 'name'>;

export type UpdateNameFormErrors = FormErrors<UpdateNameForm>;

import type {
    ChangeEmailOtpForm,
    ChangeEmailOtpFormErrors,
} from '@/app/(shop)/profile/profile.types';
import { validateOtp } from '@/services/user/validation/validate-otp';

//TODO Вынести, повтор validateEmailOtpForm
export function validateChangeEmailOtpForm(
    form: ChangeEmailOtpForm,
): ChangeEmailOtpFormErrors {
    const errors: ChangeEmailOtpFormErrors = {};

    const otpError = validateOtp(form.otp);

    if (otpError) {
        errors.otp = otpError;
    }

    return errors;
}

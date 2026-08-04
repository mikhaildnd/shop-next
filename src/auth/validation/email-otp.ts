import type { AuthOtpForm, AuthOtpFormErrors } from '@/auth/auth.types';
import { validateOtp } from '@/services/user/validation/validate-otp';

export function validateEmailOtpForm(form: AuthOtpForm): AuthOtpFormErrors {
    const errors: AuthOtpFormErrors = {};

    const otpError = validateOtp(form.otp);

    if (otpError) {
        errors.otp = otpError;
    }

    return errors;
}

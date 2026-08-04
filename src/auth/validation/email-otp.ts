import type { AuthOtpForm, AuthOtpFormErrors } from '@/auth/auth.types';
import { validateOtp } from '@/auth/validation/fields/validate-otp';

export function validateEmailOtpForm(form: AuthOtpForm): AuthOtpFormErrors {
    const errors: AuthOtpFormErrors = {};

    const otpError = validateOtp(form.otp);

    if (otpError) {
        errors.otp = otpError;
    }

    return errors;
}

import type { AuthOtpForm, AuthOtpFormErrors } from '@/auth/auth.types';
import { validateOtp } from '@/services/user/validators/validate-otp';

export function validateOtpForm(form: AuthOtpForm): AuthOtpFormErrors {
    const errors: AuthOtpFormErrors = {};

    const otpError = validateOtp(form.otp);

    if (otpError) {
        errors.otp = otpError;
    }

    return errors;
}

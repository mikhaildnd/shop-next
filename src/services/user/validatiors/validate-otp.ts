import { OTP_LENGTH, OTP_REGEXP } from '@/auth/auth.consts';

export function validateOtp(otp: string): string | undefined {
    if (!otp) {
        return 'Введите код';
    }

    if (!OTP_REGEXP.test(otp)) {
        return `Введите ${OTP_LENGTH}-значный код`;
    }
}

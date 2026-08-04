import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { VerifyPasswordResetForm } from '@/app/auth/password-reset/verify/_components/VerifyPasswordResetForm';
import { getPasswordResetCookie } from '@/auth/cookies/password-reset-cookie';
import { getOtpRetryAfter } from '@/auth/services/otp.service';
import { OtpPurpose } from '@/generated/prisma/client';
import { routes } from '@/lib/routes';

export default async function VerifyPasswordResetPage() {
    const passwordReset = await getPasswordResetCookie();

    if (!passwordReset) {
        redirect(routes.passwordResetPage());
    }

    if (passwordReset.otp) {
        redirect(routes.passwordSetPage());
    }

    const { email } = passwordReset;

    const initialSeconds = await getOtpRetryAfter({
        identifier: email,
        purpose: OtpPurpose.PASSWORD_RESET,
    });

    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Введите код"
                description={`Мы отправили код подтверждения на ${email}`}
            />
            <VerifyPasswordResetForm initialSeconds={initialSeconds} />
        </AuthSurface>
    );
}

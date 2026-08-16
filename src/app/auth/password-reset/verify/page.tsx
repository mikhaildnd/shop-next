import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { VerifyPasswordResetForm } from '@/app/auth/password-reset/verify/_components/VerifyPasswordResetForm';
import { passwordResetCookie } from '@/auth/cookies/password-reset-cookie';
import { routes } from '@/routes';
import { getRateLimitState } from '@/services/rate-limit/rate-limit.service';

export default async function VerifyPasswordResetPage() {
    const passwordReset = await passwordResetCookie.get();

    if (!passwordReset) {
        redirect(routes.signInPage());
    }

    if (passwordReset.otp) {
        redirect(routes.passwordSetPage());
    }

    const { email } = passwordReset;

    const activeRateLimit = await getRateLimitState({
        action: 'password-reset-otp',
        identifier: email,
    });

    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Введите код"
                description={`Мы отправили код подтверждения на ${email}`}
            />
            <VerifyPasswordResetForm expiresAt={activeRateLimit?.expiresAt} />
        </AuthSurface>
    );
}

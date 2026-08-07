import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { VerifyPasswordResetForm } from '@/app/auth/password-reset/verify/_components/VerifyPasswordResetForm';
import { passwordResetCookie } from '@/auth/cookies/password-reset-cookie';
import { routes } from '@/lib/routes';

export default async function VerifyPasswordResetPage() {
    const passwordReset = await passwordResetCookie.get();

    if (!passwordReset) {
        redirect(routes.passwordResetPage());
    }

    if (passwordReset.otp) {
        redirect(routes.passwordSetPage());
    }

    const { email } = passwordReset;

    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Введите код"
                description={`Мы отправили код подтверждения на ${email}`}
            />
            <VerifyPasswordResetForm />
        </AuthSurface>
    );
}

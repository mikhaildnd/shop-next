import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { PasswordSetForm } from '@/app/auth/password-reset/set-password/_components/PasswordSetForm';
import { getPasswordResetCookie } from '@/auth/cookies/password-reset-cookie';
import { routes } from '@/lib/routes';

export default async function PasswordSetPage() {
    const passwordReset = await getPasswordResetCookie();

    if (!passwordReset) {
        redirect(routes.passwordResetPage());
    }

    if (!passwordReset.otp) {
        redirect(routes.passwordResetVerifyPage());
    }

    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Новый пароль"
                description="Придумайте новый пароль для вашей учетной записи."
            />
            <PasswordSetForm />
        </AuthSurface>
    );
}

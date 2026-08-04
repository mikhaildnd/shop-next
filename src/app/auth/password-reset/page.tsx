import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { PasswordResetForm } from '@/app/auth/password-reset/_components/PasswordResetForm';
import { getPasswordResetCookie } from '@/auth/cookies/password-reset-cookie';
import { routes } from '@/lib/routes';

export default async function PasswordResetPage() {
    const passwordReset = await getPasswordResetCookie();

    if (passwordReset?.otp) {
        redirect(routes.passwordSetPage());
    }

    if (passwordReset?.email) {
        redirect(routes.passwordResetVerifyPage());
    }

    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Сброс пароля"
                description="Введите подтвержденный адрес электронной почты вашей учетной записи, и мы вышлем вам код для сброса пароля."
            />
            <PasswordResetForm />
        </AuthSurface>
    );
}

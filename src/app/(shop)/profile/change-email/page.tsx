import { redirect } from 'next/navigation';

import { ChangeEmailForm } from '@/app/(shop)/profile/change-email/_components/ChangeEmailForm';
import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';

export default async function ChangeEmailPage() {
    const session = await getSession();

    if (!session) {
        redirect(routes.signInPage());
    }

    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Смена E-mail"
                description="Введите новый адрес электронной почты."
            />

            <ChangeEmailForm />
        </AuthSurface>
    );
}

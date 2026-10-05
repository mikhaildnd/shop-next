import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { ChangeEmailForm } from '@/app/auth/change-email/_components/ChangeEmailForm';
import { getAuthenticatedUser } from '@/auth/session';
import { routes } from '@/routes';
import { getRateLimitState } from '@/services/rate-limit/rate-limit.service';

export default async function ChangeEmailPage() {
    const user = await getAuthenticatedUser();

    if (!user) {
        redirect(routes.signInPage());
    }

    const activeRateLimit = await getRateLimitState({
        action: 'change-email',
        identifier: user.id,
    });

    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Смена E-mail"
                description="Введите новый адрес электронной почты."
            />

            <ChangeEmailForm expiresAt={activeRateLimit?.expiresAt} />
        </AuthSurface>
    );
}

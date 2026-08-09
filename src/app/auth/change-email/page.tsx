import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { ChangeEmailForm } from '@/app/auth/change-email/_components/ChangeEmailForm';
import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';
import { getRateLimitState } from '@/services/rate-limit/rate-limit.service';

export default async function ChangeEmailPage() {
    const session = await getSession();

    if (!session) {
        redirect(routes.signInPage());
    }

    const activeRateLimit = await getRateLimitState({
        action: 'change-email',
        identifier: session.user.id,
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

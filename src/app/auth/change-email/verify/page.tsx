import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { VerifyEmailChangeForm } from '@/app/auth/change-email/verify/_components/VerifyEmailChangeForm';
import { changeEmailCookie } from '@/auth/cookies/change-email-cookie';
import { getSession } from '@/auth/session';
import { routes } from '@/routes';
import { getRateLimitState } from '@/services/rate-limit/rate-limit.service';

export default async function VerifyChangeEmailPage() {
    const session = await getSession();

    if (!session) {
        redirect(routes.signInPage());
    }

    const emailChange = await changeEmailCookie.get();

    if (!emailChange) {
        redirect(routes.changeEmailPage());
    }

    const { email } = emailChange;

    const activeRateLimit = await getRateLimitState({
        action: 'change-email-otp',
        identifier: session.user.id,
    });

    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Введите код"
                description="Мы отправили код подтверждения на"
            >
                <div className="flex items-center justify-between gap-2">
                    <span>{email}</span>

                    <Link
                        href={routes.changeEmailPage()}
                        className="link-style"
                    >
                        Изменить
                    </Link>
                </div>
            </AuthSurface.Header>
            <VerifyEmailChangeForm expiresAt={activeRateLimit?.expiresAt} />
        </AuthSurface>
    );
}

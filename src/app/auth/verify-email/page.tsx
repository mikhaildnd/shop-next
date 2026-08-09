import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { VerifyEmailForm } from '@/app/auth/verify-email/_components/VerifyEmailForm';
import { restartSignUp } from '@/app/auth/verify-email/actions';
import { verifyEmailCookie } from '@/auth/cookies/verify-email-cookie';
import { routes } from '@/lib/routes';
import { getRateLimitState } from '@/services/rate-limit/rate-limit.service';

export default async function VerifyEmailPage() {
    const verifyEmail = await verifyEmailCookie.get();

    if (!verifyEmail) {
        redirect(routes.signInPage());
    }

    const { email } = verifyEmail;

    const activeRateLimit = await getRateLimitState({
        action: 'sign-up-otp',
        identifier: email,
    });

    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Введите код"
                description="Код подтверждения отправлен."
            >
                <div className="flex items-center justify-between gap-2">
                    <span>{email}</span>

                    <form action={restartSignUp}>
                        <button
                            type="submit"
                            className="link-style"
                        >
                            Изменить
                        </button>
                    </form>
                </div>
            </AuthSurface.Header>
            <VerifyEmailForm expiresAt={activeRateLimit?.expiresAt} />
        </AuthSurface>
    );
}

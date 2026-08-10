import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { verifyEmailCookie } from '@/auth/cookies/verify-email-cookie';
import { routes } from '@/lib/routes';
import { getRateLimitState } from '@/services/rate-limit/rate-limit.service';
import {
    restartSignIn,
    restartSignUp,
} from '@/app/auth/email-verification/actions';
import { EmailVerificationForm } from '@/app/auth/email-verification/_components/EmailVerificationForm';

export default async function VerifyEmailPage() {
    const verifyEmail = await verifyEmailCookie.get();

    if (!verifyEmail) {
        redirect(routes.signInPage());
    }

    const { email, source } = verifyEmail;

    const activeRateLimit = await getRateLimitState({
        action: 'sign-up-otp',
        identifier: email,
    });

    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Введите код"
                description="Код подтверждения отправлен"
            >
                <div className="flex items-center justify-between gap-2">
                    <span>{email}</span>

                    <form
                        action={
                            source === 'sign-up' ? restartSignUp : restartSignIn
                        }
                    >
                        <button
                            type="submit"
                            className="link-style"
                        >
                            Изменить
                        </button>
                    </form>
                </div>
            </AuthSurface.Header>

            <EmailVerificationForm expiresAt={activeRateLimit?.expiresAt} />
        </AuthSurface>
    );
}

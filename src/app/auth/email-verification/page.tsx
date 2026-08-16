import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { EmailVerificationForm } from '@/app/auth/email-verification/_components/EmailVerificationForm';
import { verifyEmailCookie } from '@/auth/cookies/verify-email-cookie';
import { routes } from '@/routes';
import { getRateLimitState } from '@/services/rate-limit/rate-limit.service';

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
                    <Link
                        href={
                            source === 'sign-up'
                                ? routes.signUpPage()
                                : routes.signInPage()
                        }
                        className="link-style"
                    >
                        Изменить
                    </Link>
                </div>
            </AuthSurface.Header>

            <EmailVerificationForm expiresAt={activeRateLimit?.expiresAt} />
        </AuthSurface>
    );
}

import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { VerifyEmailForm } from '@/app/auth/verify-email/_components/VerifyEmailForm';
import { getVerifyEmailCookie } from '@/auth/cookies/verify-email-cookie';
import { getOtpRetryAfter } from '@/auth/services/otp.service';
import { OtpPurpose } from '@/generated/prisma/client';
import { routes } from '@/lib/routes';

export default async function VerifyEmailPage() {
    const email = await getVerifyEmailCookie();

    if (!email) {
        redirect(routes.signInPage());
    }

    const initialSeconds = await getOtpRetryAfter({
        identifier: email,
        purpose: OtpPurpose.EMAIL_VERIFICATION,
    });

    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Введите код"
                description={`Мы отправили код подтверждения на ${email}`}
            />
            <VerifyEmailForm initialSeconds={initialSeconds} />
        </AuthSurface>
    );
}

import { redirect } from 'next/navigation';

import { VerifyEmailChangeForm } from '@/app/(shop)/profile/change-email/verify/_components/VerifyEmailChangeForm';
import { restartEmailChange } from '@/app/(shop)/profile/change-email/verify/actions';
import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { changeEmailCookie } from '@/auth/cookies/change-email-cookie';
import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';

export default async function VerifyChangeEmailPage() {
    const session = await getSession();

    if (!session) {
        redirect(routes.signInPage());
    }

    const emailChange = await changeEmailCookie.get();

    if (!emailChange) {
        redirect(routes.profileChangeEmailPage());
    }

    const { email } = emailChange;

    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Введите код"
                description="Мы отправили код подтверждения на"
            >
                <div className="flex items-center justify-between gap-2">
                    <span>{email}</span>

                    <form action={restartEmailChange}>
                        <button
                            type="submit"
                            className="link-style"
                        >
                            Изменить
                        </button>
                    </form>
                </div>
            </AuthSurface.Header>
            <VerifyEmailChangeForm />
        </AuthSurface>
    );
}

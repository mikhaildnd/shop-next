import { redirect } from 'next/navigation';

import { VerifyEmailForm } from '@/app/auth/verify-email/_components/VerifyEmailForm';
import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';

export default async function VerifyEmailPage() {
    const session = await getSession();

    if (!session) {
        redirect(routes.signInPage());
    }

    if (session.user.emailVerified) {
        redirect(routes.homePage());
    }

    return <VerifyEmailForm email={session.user.email} />;
}

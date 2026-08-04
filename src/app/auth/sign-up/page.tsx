import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { EmailSignUpForm } from '@/app/auth/sign-up/_components/EmailSignUpForm';
import {
    clearVerifyEmailCookie,
    getVerifyEmailCookie,
} from '@/auth/cookies/verify-email-cookie';
import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';
import { getUserByEmail } from '@/services/user/user.service';

export default async function SignUpPage() {
    const session = await getSession();

    if (session) {
        redirect(routes.profilePage());
    }

    const email = await getVerifyEmailCookie();

    if (email) {
        const user = await getUserByEmail(email);

        if (user && !user.emailVerified) {
            redirect(routes.verifyEmailPage());
        }

        await clearVerifyEmailCookie();
    }

    return (
        <AuthSurface>
            <AuthSurface.Header title="Регистрация" />
            <EmailSignUpForm />

            <AuthSurface.Footer>
                <div className="flex justify-center">
                    <p className="text-sm">
                        Есть аккаунт?{' '}
                        <Link
                            href={routes.signInPage()}
                            className="focus-ring link-style"
                        >
                            Войти
                        </Link>
                    </p>
                </div>
            </AuthSurface.Footer>
        </AuthSurface>
    );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { EmailSignUpForm } from '@/app/auth/sign-up/_components/EmailSignUpForm';
import { getSession } from '@/auth/session';
import { routes } from '@/routes';

export default async function SignUpPage() {
    const session = await getSession();

    if (session) {
        redirect(routes.homePage());
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
                            className="link-style focus-ring"
                        >
                            Войти
                        </Link>
                    </p>
                </div>
            </AuthSurface.Footer>
        </AuthSurface>
    );
}

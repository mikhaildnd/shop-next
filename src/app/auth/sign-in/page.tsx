import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { EmailSignInForm } from '@/app/auth/sign-in/_components/EmailSignInForm';
import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';

export default async function SignInPage() {
    const session = await getSession();

    if (session) {
        redirect(routes.profilePage());
    }

    return (
        <AuthSurface>
            <AuthSurface.Header title="Вход в магазин" />

            <EmailSignInForm />

            <AuthSurface.Footer>
                <div className="flex justify-center">
                    <p className="text-sm">
                        Впервые на сайте?{' '}
                        <Link
                            href={routes.signUpPage()}
                            className="focus-ring link-style"
                        >
                            Создайте аккаунт
                        </Link>
                    </p>
                </div>
            </AuthSurface.Footer>
        </AuthSurface>
    );
}

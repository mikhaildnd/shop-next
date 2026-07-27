import { redirect } from 'next/navigation';

import { EmailSignInForm } from '@/app/auth/sign-in/_components/EmailSignInForm';
import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';

export default async function SignInPage() {
    const session = await getSession();

    if (session) {
        redirect(routes.homePage());
    }

    return <EmailSignInForm />;
}

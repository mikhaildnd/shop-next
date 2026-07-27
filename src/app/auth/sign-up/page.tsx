import { redirect } from 'next/navigation';

import { EmailSignUpForm } from '@/app/auth/sign-up/_components/EmailSignUpForm';
import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';

export default async function SignUpPage() {
    const session = await getSession();

    if (session) {
        redirect(routes.homePage());
    }

    return <EmailSignUpForm />;
}

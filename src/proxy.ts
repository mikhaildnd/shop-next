import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth } from '@/auth/auth';
import { routes } from '@/lib/routes';

const guestRoutes = new Set([routes.signInPage(), routes.signUpPage()]);

const protectedRoutes = new Set([routes.profilePage()]);

const verificationRoutes = new Set([routes.verifyEmailPage()]);

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const { pathname } = request.nextUrl;

    if (guestRoutes.has(pathname) && session) {
        return NextResponse.redirect(
            new URL(routes.profilePage(), request.url),
        );
    }

    if (protectedRoutes.has(pathname) && !session) {
        return NextResponse.redirect(new URL(routes.signInPage(), request.url));
    }

    if (verificationRoutes.has(pathname)) {
        if (!session) {
            return NextResponse.redirect(
                new URL(routes.signInPage(), request.url),
            );
        }

        if (session.user.emailVerified) {
            return NextResponse.redirect(
                new URL(routes.profilePage(), request.url),
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/auth/sign-in',
        '/auth/sign-up',
        '/auth/verify-email',
        '/profile',
    ],
};

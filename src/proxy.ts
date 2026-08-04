import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth } from '@/auth/auth';
import { routes } from '@/lib/routes';

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const { pathname } = request.nextUrl;

    if (!session && pathname === routes.profilePage()) {
        return NextResponse.redirect(new URL(routes.signInPage(), request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile'],
};

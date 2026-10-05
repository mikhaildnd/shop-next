import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getSession } from '@/auth/session';
import { routes } from '@/routes';

export async function proxy(request: NextRequest) {
    const session = await getSession();

    if (!session || session.user.isAnonymous) {
        return NextResponse.redirect(new URL(routes.signInPage(), request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*'],
};

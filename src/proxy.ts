import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';

export async function proxy(request: NextRequest) {
    const session = await getSession();

    if (!session) {
        return NextResponse.redirect(new URL(routes.signInPage(), request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*'],
};

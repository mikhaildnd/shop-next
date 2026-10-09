'use server';

import {
    createAnonymousSession,
    getSession,
    requireSession,
} from '@/auth/session';
import {
    addFavorite,
    removeFavorite,
} from '@/services/favorite/favorite.service';

export async function addFavoriteAction(productId: string) {
    const session = await getSession();

    if (session) {
        await addFavorite(session.user.id, productId);
        return;
    }

    const anonymousSession = await createAnonymousSession();

    await addFavorite(anonymousSession.user.id, productId);
}

export async function removeFavoriteAction(productId: string) {
    const session = await requireSession();

    await removeFavorite(session.user.id, productId);
}

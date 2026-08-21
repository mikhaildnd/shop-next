import type { ReactNode } from 'react';

import { getSession } from '@/auth/session';
import { FavoritesProvider } from '@/components/favorite/FavoritesContext';
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import type { ProfileUser } from '@/components/header/profile/profile.types';
import { getFavoriteCount } from '@/services/favorite/favorite.service';

interface ShopLayoutProps {
    children: ReactNode;
}

export default async function ShopLayout({ children }: ShopLayoutProps) {
    const session = await getSession();

    const user = session?.user;

    const profileUser: ProfileUser | null = user
        ? { name: user.name, email: user.email }
        : null;

    const favoriteCount = user ? await getFavoriteCount(user.id) : 0;

    return (
        <FavoritesProvider
            isAuthenticated={Boolean(session)}
            initialFavoriteCount={favoriteCount}
        >
            <Header user={profileUser} />
            <main className="wrapper grow overflow-x-clip">{children}</main>
            <Footer className="pb-(--bottom-nav-height) md:pb-0" />
        </FavoritesProvider>
    );
}

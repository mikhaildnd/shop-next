import type { ReactNode } from 'react';

import { getSession } from '@/auth/session';
import { FavoritesProvider } from '@/components/favorite/FavoritesContext';
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import type { ProfileUser } from '@/components/header/profile/profile.types';

interface ShopLayoutProps {
    children: ReactNode;
}

export default async function ShopLayout({ children }: ShopLayoutProps) {
    const session = await getSession();

    const user = session?.user;

    const profileUser: ProfileUser | null = user
        ? { name: user.name, email: user.email }
        : null;

    return (
        <FavoritesProvider>
            <Header user={profileUser} />
            <main className="wrapper grow overflow-x-hidden">{children}</main>
            <Footer className="pb-(--bottom-nav-height) md:pb-0" />
        </FavoritesProvider>
    );
}

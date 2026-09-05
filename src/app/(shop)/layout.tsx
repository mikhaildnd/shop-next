import type { ReactNode } from 'react';

import { getSession } from '@/auth/session';
import { CartProvider } from '@/components/cart/CartContext';
import { FavoritesProvider } from '@/components/favorite/FavoritesContext';
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import { MobileNavigation } from '@/components/header/MobileNavigation';
import type { ProfileUser } from '@/components/header/profile/profile.types';
import { getCart } from '@/services/cart/cart.service';
import { getFavoriteIds } from '@/services/favorite/favorite.service';

interface ShopLayoutProps {
    children: ReactNode;
}

export default async function ShopLayout({ children }: ShopLayoutProps) {
    const session = await getSession();

    const user = session?.user;

    const profileUser: ProfileUser | null = user
        ? { name: user.name, email: user.email }
        : null;

    const favoriteIds = user ? await getFavoriteIds(user.id) : [];

    const favoriteCount = favoriteIds.length;

    const initialCartState = user ? await getCart(user.id) : { items: [] };

    return (
        <CartProvider
            isAuthenticated={Boolean(session)}
            initialCartState={initialCartState}
        >
            <FavoritesProvider
                isAuthenticated={Boolean(session)}
                initialFavoriteIds={favoriteIds}
                initialFavoriteCount={favoriteCount}
            >
                <Header user={profileUser} />
                <main className="wrapper grow overflow-x-clip">{children}</main>
                <Footer className="pb-(--bottom-nav-height) md:pb-0" />
                <MobileNavigation
                    className="md:hidden"
                    user={profileUser}
                />
            </FavoritesProvider>
        </CartProvider>
    );
}

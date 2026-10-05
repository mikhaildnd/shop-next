import type { ReactNode } from 'react';

import { getSession } from '@/auth/session';
import { CartProvider } from '@/components/cart/CartContext';
import { FavoritesProvider } from '@/components/favorite/FavoritesContext';
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import { MobileNavigation } from '@/components/header/MobileNavigation';
import type { ProfileUser } from '@/components/header/profile/profile.types';
import { getReconciledCartData } from '@/services/cart/cart.service';
import type { CartData } from '@/services/cart/cart.types';
import { getFavoriteIds } from '@/services/favorite/favorite.service';

interface ShopLayoutProps {
    children: ReactNode;
}

export default async function ShopLayout({ children }: ShopLayoutProps) {
    const session = await getSession();

    const user = session?.user;
    const authenticatedUser = user && !user.isAnonymous ? user : null;

    const profileUser: ProfileUser | null = authenticatedUser
        ? {
              name: authenticatedUser.name,
              email: authenticatedUser.email,
          }
        : null;

    const favoriteIds = user ? await getFavoriteIds(user.id) : [];

    const initialCartState: CartData = user
        ? await getReconciledCartData(user.id)
        : {
              cart: { items: [] },
              products: [],
          };

    return (
        <CartProvider initialCartState={initialCartState}>
            <FavoritesProvider
                isAuthenticated={Boolean(session)}
                initialFavoriteIds={favoriteIds}
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

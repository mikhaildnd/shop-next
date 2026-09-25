import type { ReactNode } from 'react';

import { getSession } from '@/auth/session';
import { CartProvider } from '@/components/cart/CartContext';
import { FavoritesProvider } from '@/components/favorite/FavoritesContext';
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import { MobileNavigation } from '@/components/header/MobileNavigation';
import type { ProfileUser } from '@/components/header/profile/profile.types';
import { getCart, getCartProductsByIds } from '@/services/cart/cart.service';
import type { CartInitialData } from '@/services/cart/cart.types';
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

    const cart = user ? await getCart(user.id) : { items: [] };

    const products = user
        ? await getCartProductsByIds(
              cart.items.map((item) => item.productId),
          )
        : [];

    const initialCartState: CartInitialData = {
        cart,
        products,
    };

    return (
        <CartProvider
            isAuthenticated={Boolean(session)}
            initialCartState={initialCartState}
        >
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

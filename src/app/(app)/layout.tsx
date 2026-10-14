import type { ReactNode } from 'react';

import { getPendingAccountMerge } from '@/auth/actions/account-merge.actions';
import { getSession } from '@/auth/session';
import { AccountMergeToast } from '@/components/account/AccountMergeToast';
import { CartProvider } from '@/components/cart/CartContext';
import { FavoritesProvider } from '@/components/favorite/FavoritesContext';
import { getReconciledCart } from '@/services/cart/cart.service';
import type { CartData } from '@/services/cart/cart.types';
import { getFavoriteIds } from '@/services/favorite/favorite.service';

interface AppLayoutProps {
    children: ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
    const session = await getSession();

    const user = session?.user;
    const authenticatedUser = user && !user.isAnonymous ? user : null;

    const hasPendingMerge = authenticatedUser
        ? await getPendingAccountMerge()
        : false;

    const favoriteIds = user ? await getFavoriteIds(user.id) : [];

    const initialCartState: CartData = user
        ? await getReconciledCart(user.id)
        : {
              cart: { items: [] },
              products: [],
          };

    return (
        <CartProvider
            key={user?.id ?? 'guest'}
            initialCartState={initialCartState}
        >
            <FavoritesProvider initialFavoriteIds={favoriteIds}>
                {hasPendingMerge && <AccountMergeToast />}
                {children}
            </FavoritesProvider>
        </CartProvider>
    );
}

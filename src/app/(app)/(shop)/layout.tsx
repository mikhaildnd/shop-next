import type { ReactNode } from 'react';

import { getSession } from '@/auth/session';
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import { MobileNavigation } from '@/components/header/MobileNavigation';
import type { ProfileUser } from '@/components/header/profile/profile.types';

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

    return (
        <>
            <Header user={profileUser} />
            <main className="wrapper grow overflow-x-clip">{children}</main>
            <Footer className="pb-(--bottom-nav-height) md:pb-0" />
            <MobileNavigation
                className="md:hidden"
                user={profileUser}
            />
        </>
    );
}

import { Suspense } from 'react';

import { getSession } from '@/auth/session';
import { CatalogLink } from '@/components/header/CatalogLink';
import { DesktopNavigation } from '@/components/header/DesktopNavigation';
import { MobileNavigation } from '@/components/header/MobileNavigation';
import type { ProfileUser } from '@/components/header/profile/profile.types';
import { DesktopSearch } from '@/components/header/search/DesktopSearch';
import { MobileSearch } from '@/components/header/search/MobileSearch';
import { SearchProvider } from '@/components/header/search/SearchContext';
import { Logo } from '@/components/logo/Logo';

export async function Header() {
    const session = await getSession();

    const user = session?.user;

    const profileUser: ProfileUser | null = user
        ? { name: user.name, email: user.email }
        : null;

    return (
        <header className="relative z-10 flex wrapper items-center gap-x-4 bg-white py-2 shadow-(--shadow-default) md:gap-x-5 xl:gap-x-6 xl:py-3">
            <Logo />
            <CatalogLink className="hidden md:flex" />
            <Suspense fallback={null}>
                <SearchProvider>
                    <DesktopSearch className="hidden grow md:block" />
                    <MobileSearch className="ml-auto md:hidden" />
                </SearchProvider>
            </Suspense>
            <DesktopNavigation
                className="hidden md:flex"
                user={profileUser}
            />
            <MobileNavigation
                className="md:hidden"
                user={profileUser}
            />
        </header>
    );
}

import { Suspense } from 'react';

import { CatalogLink } from '@/components/header/CatalogLink';
import { DesktopNavigation } from '@/components/header/DesktopNavigation';
import { MobileNavigation } from '@/components/header/MobileNavigation';
import { DesktopSearch } from '@/components/header/search/DesktopSearch';
import { MobileSearch } from '@/components/header/search/MobileSearch';
import { SearchProvider } from '@/components/header/search/SearchContext';
import { Logo } from '@/components/logo/Logo';

export function Header() {
    return (
        <header className="relative z-10 flex wrapper items-center gap-x-4 bg-white py-3 md:gap-x-5 md:py-4 md:shadow-(--shadow-default) xl:gap-x-6">
            <Logo />
            <CatalogLink />
            <Suspense fallback={null}>
                <SearchProvider>
                    <DesktopSearch className="hidden grow md:block" />
                    <MobileSearch className="ml-auto md:hidden" />
                </SearchProvider>
            </Suspense>
            <DesktopNavigation className="hidden md:flex" />
            <MobileNavigation className="ml-auto md:hidden" />
        </header>
    );
}

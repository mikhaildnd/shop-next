import { CatalogLink } from '@/components/header/CatalogLink';
import { DesktopNavigation } from '@/components/header/DesktopNavigation';
import { MobileNavigation } from '@/components/header/MobileNavigation';
import type { ProfileUser } from '@/components/header/profile/profile.types';
import { DesktopSearch } from '@/components/header/search/DesktopSearch';
import { MobileSearch } from '@/components/header/search/MobileSearch';
import { SearchProvider } from '@/components/header/search/SearchContext';
import { Logo } from '@/components/logo/Logo';

interface HeaderProps {
    user: ProfileUser | null;
}

export function Header({ user }: HeaderProps) {
    return (
        <header className="relative z-10 flex wrapper items-center gap-x-4 bg-white py-2 shadow-(--shadow-default) md:gap-x-5 xl:gap-x-6 xl:py-3">
            <Logo />
            <CatalogLink className="hidden md:flex" />
            <SearchProvider>
                <DesktopSearch className="hidden grow md:block" />
                <MobileSearch className="ml-auto md:hidden" />
            </SearchProvider>
            <DesktopNavigation
                className="hidden md:flex"
                user={user}
            />
            <MobileNavigation
                className="md:hidden"
                user={user}
            />
        </header>
    );
}

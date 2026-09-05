'use client';

import { CatalogLink } from '@/components/header/CatalogLink';
import { DesktopNavigation } from '@/components/header/DesktopNavigation';
import type { ProfileUser } from '@/components/header/profile/profile.types';
import { DesktopSearch } from '@/components/header/search/DesktopSearch';
import { MobileSearch } from '@/components/header/search/MobileSearch';
import { SearchProvider } from '@/components/header/search/SearchContext';
import { Logo } from '@/components/logo/Logo';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/cn';

interface HeaderProps {
    user: ProfileUser | null;
}

const HEADER_HIDE_THRESHOLD = 200;

export function Header({ user }: HeaderProps) {
    const { direction, scrollY } = useScrollDirection();

    const isHidden = direction === 'down' && scrollY > HEADER_HIDE_THRESHOLD;

    return (
        <header
            className={cn(
                'sticky top-0 z-10 flex wrapper items-center gap-x-4 bg-white py-2 shadow-(--shadow-bottom) md:gap-x-5 xl:gap-x-6 xl:py-3',
                'transition-transform duration-(--transition-duration-default)',
                isHidden && 'max-md:-translate-y-full max-md:shadow-none',
            )}
        >
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
        </header>
    );
}

import { Suspense } from 'react';

import { CatalogButton } from '@/components/header/CatalogButton';
import { Search } from '@/components/header/search/Search';
import { UserMenu } from '@/components/header/UserMenu';
import { Logo } from '@/components/logo/Logo';

export function Header() {
    return (
        <header className="relative z-10 flex wrapper items-center gap-x-4 bg-white py-3 md:gap-x-5 md:py-4 md:shadow-(--shadow-default) xl:gap-x-6">
            <Logo className="shrink-0" />
            <CatalogButton />
            <Suspense fallback={null}>
                <Search />
            </Suspense>
            <UserMenu className="ml-auto" />
        </header>
    );
}

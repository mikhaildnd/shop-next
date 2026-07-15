'use client';

import { MobileSearch } from '@/components/header/search/MobileSearch';
import { SearchProvider } from '@/components/header/search/SearchContext';

import { DesktopSearch } from './DesktopSearch';

export function Search() {
    return (
        <SearchProvider>
            <DesktopSearch />
            <MobileSearch />
        </SearchProvider>
    );
}

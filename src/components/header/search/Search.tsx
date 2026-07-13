'use client';

import { MobileSearch } from '@/components/header/search/mobile/MobileSearch';
import { SearchProvider } from '@/components/header/search/SearchContext';

import { DesktopSearch } from './desktop/DesktopSearch';

export function Search() {
    return (
        <SearchProvider>
            <DesktopSearch />
            <MobileSearch />
        </SearchProvider>
    );
}

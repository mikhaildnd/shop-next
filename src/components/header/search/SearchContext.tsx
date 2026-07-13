'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { useSearch } from '@/components/header/search/useSearch';

type SearchContextValue = ReturnType<typeof useSearch>;

const SearchContext = createContext<SearchContextValue | null>(null);

interface SearchProviderProps {
    children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
    const search = useSearch();

    return (
        <SearchContext.Provider value={search}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearchContext() {
    const context = useContext(SearchContext);

    if (!context) {
        throw new Error('useSearchContext must be used within SearchProvider');
    }

    return context;
}

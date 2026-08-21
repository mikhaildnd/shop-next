'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { useSearch } from '@/components/header/search/hooks/useSearch';
import { useSearchHistory } from '@/components/header/search/hooks/useSearchHistory';

type SearchContextValue = {
    search: ReturnType<typeof useSearch>;
    history: ReturnType<typeof useSearchHistory>;
};

const SearchContext = createContext<SearchContextValue | null>(null);

interface SearchProviderProps {
    children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
    const search = useSearch();
    const history = useSearchHistory();

    return (
        <SearchContext.Provider value={{ search, history }}>
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

'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { useFavorites } from '@/hooks/useFavorites';

const FavoritesContext = createContext<ReturnType<typeof useFavorites> | null>(
    null,
);

interface FavoritesProviderProps {
    children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
    const favorites = useFavorites();

    return (
        <FavoritesContext.Provider value={favorites}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavoritesContext() {
    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error(
            'useFavoritesContext must be used within FavoritesProvider',
        );
    }

    return context;
}

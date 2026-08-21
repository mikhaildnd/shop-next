'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { useFavorites } from '@/hooks/useFavorites';

const FavoritesContext = createContext<ReturnType<typeof useFavorites> | null>(
    null,
);

interface FavoritesProviderProps {
    isAuthenticated: boolean;
    initialFavoriteCount: number;
    children: ReactNode;
}

export function FavoritesProvider({
    isAuthenticated,
    initialFavoriteCount,
    children,
}: FavoritesProviderProps) {
    const favorites = useFavorites({ isAuthenticated, initialFavoriteCount });

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

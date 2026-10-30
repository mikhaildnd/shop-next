'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { useFavorites } from '@/hooks/useFavorites';

interface FavoritesContextValue {
    favoriteIds: Set<string>;
    favoriteCount: number;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (productId: string) => void | Promise<void>;
    replaceFavorites: (favoriteIds: string[]) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

interface FavoritesProviderProps {
    initialFavoriteIds: string[];
    children: ReactNode;
}

export function FavoritesProvider({
    initialFavoriteIds,
    children,
}: FavoritesProviderProps) {
    const favorites = useFavorites({
        initialFavoriteIds,
    });

    const contextValue: FavoritesContextValue = {
        favoriteIds: favorites.favoriteIds,
        favoriteCount: favorites.favoriteCount,
        isFavorite: favorites.isFavorite,
        toggleFavorite: favorites.toggleFavorite,
        replaceFavorites: favorites.replaceFavorites,
    };

    return (
        <FavoritesContext.Provider value={contextValue}>
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

'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { createContext, useContext } from 'react';

import { useFavorites } from '@/hooks/useFavorites';
import { createActionQueue } from '@/lib/async/action-queue';

interface FavoritesContextValue {
    favoriteIds: Set<string>;
    favoriteCount: number;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (productId: string) => void | Promise<void>;
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
    const [actionQueue] = useState(createActionQueue);

    const favorites = useFavorites({
        initialFavoriteIds,
        actionQueue,
    });

    const contextValue: FavoritesContextValue = {
        favoriteIds: favorites.favoriteIds,
        favoriteCount: favorites.favoriteCount,
        isFavorite: favorites.isFavorite,
        toggleFavorite: favorites.toggleFavorite,
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

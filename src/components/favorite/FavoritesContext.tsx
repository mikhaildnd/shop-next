'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { NotificationToast } from '@/components/NotificationToast';
import { useLocalFavorites } from '@/hooks/useLocalFavorites';
import { useServerFavorites } from '@/hooks/useServerFavorites';

interface FavoritesContextValue {
    favoriteIds: Set<string>;
    favoriteCount: number;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (productId: string) => void | Promise<void>;
    mutationError: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

interface FavoritesProviderProps {
    isAuthenticated: boolean;
    initialFavoriteIds: string[];
    initialFavoriteCount: number;
    children: ReactNode;
}

interface LocalFavoritesProviderProps {
    children: ReactNode;
}

interface ServerFavoritesProviderProps {
    initialFavoriteIds: string[];
    initialFavoriteCount: number;
    children: ReactNode;
}

export function FavoritesProvider({
    isAuthenticated,
    initialFavoriteIds,
    initialFavoriteCount,
    children,
}: FavoritesProviderProps) {
    if (isAuthenticated) {
        return (
            <ServerFavoritesProvider
                initialFavoriteIds={initialFavoriteIds}
                initialFavoriteCount={initialFavoriteCount}
            >
                {children}
            </ServerFavoritesProvider>
        );
    }

    return <LocalFavoritesProvider>{children}</LocalFavoritesProvider>;
}

function LocalFavoritesProvider({ children }: LocalFavoritesProviderProps) {
    const favorites = useLocalFavorites();

    const contextValue: FavoritesContextValue = {
        favoriteIds: favorites.favoriteIds,
        favoriteCount: favorites.favoriteIds.size,
        isFavorite: favorites.isFavorite,
        toggleFavorite: favorites.toggleFavorite,
        mutationError: favorites.mutationError,
    };

    return (
        <>
            <FavoritesContext.Provider value={contextValue}>
                {children}
            </FavoritesContext.Provider>

            {favorites.mutationError && (
                <NotificationToast message="Произошла ошибка. Попробуйте ещё раз." />
            )}
        </>
    );
}

function ServerFavoritesProvider({
    initialFavoriteIds,
    initialFavoriteCount,
    children,
}: ServerFavoritesProviderProps) {
    const favorites = useServerFavorites({
        initialFavoriteIds,
        initialFavoriteCount,
    });

    const contextValue: FavoritesContextValue = {
        favoriteIds: new Set(initialFavoriteIds),
        favoriteCount: favorites.favoriteCount,
        isFavorite: favorites.isFavorite,
        toggleFavorite: favorites.toggleFavorite,
        mutationError: favorites.mutationError,
    };

    const notification =
        favorites.mergeStatus === 'merging' && favorites.mergeAttempt > 0
            ? {
                  message: 'Синхронизация избранного...',
                  loading: true,
              }
            : favorites.mergeStatus === 'error'
              ? {
                    message: 'Не удалось синхронизировать избранное.',
                    action: {
                        label: 'Повторить',
                        onClick: favorites.retryMerge,
                    },
                }
              : favorites.mutationError
                ? {
                      message: 'Произошла ошибка. Попробуйте ещё раз.',
                  }
                : null;

    return (
        <>
            <FavoritesContext.Provider value={contextValue}>
                {children}
            </FavoritesContext.Provider>

            {notification && <NotificationToast {...notification} />}
        </>
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

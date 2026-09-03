'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { createContext, useContext } from 'react';

import { toast } from '@/components/ui/toast';
import { useLocalFavorites } from '@/hooks/useLocalFavorites';
import { useServerFavorites } from '@/hooks/useServerFavorites';

interface FavoritesContextValue {
    favoriteIds: Set<string>;
    favoriteCount: number;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (productId: string) => void | Promise<void>;
    mutationError: Error | null;
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

    useEffect(() => {
        if (favorites.mutationError) {
            toast.add({
                description: 'Произошла ошибка. Попробуйте ещё раз',
                type: 'error',
            });
        }
    }, [favorites.mutationError]);

    return (
        <FavoritesContext.Provider value={contextValue}>
            {children}
        </FavoritesContext.Provider>
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

    const mergeToastId = useRef<string | null>(null);

    useEffect(() => {
        if (favorites.mergeStatus === 'merging') {
            if (favorites.mergeAttempt === 0) {
                return;
            }
            if (mergeToastId.current) {
                toast.update(mergeToastId.current, {
                    description: 'Синхронизация избранного...',
                    type: 'loading',
                    timeout: 0,
                    actionProps: undefined,
                });
            } else {
                mergeToastId.current = toast.add({
                    description: 'Синхронизация избранного...',
                    type: 'loading',
                    timeout: 0,
                });
            }

            return;
        }

        if (favorites.mergeStatus === 'error') {
            if (!mergeToastId.current) {
                mergeToastId.current = toast.add({
                    description: 'Не удалось синхронизировать избранное',
                    type: 'error',
                    timeout: 0,
                    actionProps: {
                        children: 'Повторить',
                        onClick: favorites.retryMerge,
                    },
                });

                return;
            }

            toast.update(mergeToastId.current, {
                description: 'Не удалось синхронизировать избранное',
                type: 'error',
                timeout: 0,
                actionProps: {
                    children: 'Повторить',
                    onClick: favorites.retryMerge,
                },
            });

            return;
        }

        if (mergeToastId.current) {
            toast.close(mergeToastId.current);
            mergeToastId.current = null;
        }
    }, [favorites.mergeAttempt, favorites.mergeStatus, favorites.retryMerge]);

    useEffect(() => {
        if (favorites.mutationError) {
            toast.add({
                description: 'Произошла ошибка. Попробуйте ещё раз',
                type: 'error',
            });
        }
    }, [favorites.mutationError]);

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

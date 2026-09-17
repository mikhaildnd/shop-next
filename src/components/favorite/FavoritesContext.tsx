'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createContext, useContext } from 'react';

import { toast } from '@/components/ui/toast';
import { useFavoritesMerge } from '@/hooks/useFavoritesMerge';
import { useLocalFavorites } from '@/hooks/useLocalFavorites';
import { useServerFavorites } from '@/hooks/useServerFavorites';
import { createActionQueue } from '@/lib/async/action-queue';

interface FavoritesContextValue {
    favoriteIds: Set<string>;
    favoriteCount: number;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (productId: string) => void | Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

interface FavoritesProviderProps {
    isAuthenticated: boolean;
    initialFavoriteIds: string[];
    children: ReactNode;
}

interface LocalFavoritesProviderProps {
    children: ReactNode;
}

interface ServerFavoritesProviderProps {
    initialFavoriteIds: string[];
    children: ReactNode;
}

export function FavoritesProvider({
    isAuthenticated,
    initialFavoriteIds,
    children,
}: FavoritesProviderProps) {
    if (isAuthenticated) {
        return (
            <ServerFavoritesProvider initialFavoriteIds={initialFavoriteIds}>
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
    };

    return (
        <FavoritesContext.Provider value={contextValue}>
            {children}
        </FavoritesContext.Provider>
    );
}

function ServerFavoritesProvider({
    initialFavoriteIds,
    children,
}: ServerFavoritesProviderProps) {
    const [actionQueue] = useState(createActionQueue);

    const favorites = useServerFavorites({
        initialFavoriteIds,
        actionQueue,
    });

    const merge = useFavoritesMerge({
        actionQueue,
        replaceFavorites: favorites.replaceFavorites,
    });

    const contextValue: FavoritesContextValue = {
        favoriteIds: favorites.favoriteIds,
        favoriteCount: favorites.favoriteCount,
        isFavorite: favorites.isFavorite,
        toggleFavorite: favorites.toggleFavorite,
    };

    const mergeToastId = useRef<string | null>(null);

    useEffect(() => {
        if (merge.mergeStatus === 'merging') {
            if (merge.mergeAttempt === 0) {
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

        if (merge.mergeStatus === 'error') {
            if (!mergeToastId.current) {
                mergeToastId.current = toast.add({
                    description: 'Не удалось синхронизировать избранное',
                    type: 'error',
                    timeout: 0,
                    actionProps: {
                        children: 'Повторить',
                        onClick: merge.retryMerge,
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
                    onClick: merge.retryMerge,
                },
            });

            return;
        }

        if (mergeToastId.current) {
            toast.close(mergeToastId.current);
            mergeToastId.current = null;
        }
    }, [merge.mergeAttempt, merge.mergeStatus, merge.retryMerge]);

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

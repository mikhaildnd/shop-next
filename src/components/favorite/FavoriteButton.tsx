'use client';

import { Heart } from 'lucide-react';

import type { IconButtonProps } from '@/components/button/icon-button/icon-button.types';
import { IconButton } from '@/components/button/icon-button/IconButton';
import { useFavoritesContext } from '@/components/favorite/FavoritesContext';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/cn';

interface FavoriteButtonProps extends Omit<
    IconButtonProps,
    'children' | 'aria-label' | 'onClick'
> {
    productId: string;
    iconClassName?: string;
}

export function FavoriteButton({
    productId,
    iconClassName,
    className,
    ...props
}: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite } = useFavoritesContext();

    const favorite = isFavorite(productId);

    async function handleToggleFavorite() {
        try {
            await toggleFavorite(productId);
        } catch {
            toast.add({
                id: 'favorites-mutation-error',
                description: 'Произошла ошибка. Попробуйте ещё раз',
                type: 'error',
            });
        }
    }

    return (
        <IconButton
            {...props}
            useGroup
            aria-label={favorite ? 'Убрать из избранного' : 'В избранное'}
            onClick={handleToggleFavorite}
            className={className}
        >
            <Heart
                className={cn(
                    'stroke-gray-400 stroke-[1.5px] transition-[fill,stroke] duration-150 group-active:stroke-red-500',
                    favorite
                        ? 'fill-red-500 stroke-red-500 group-active:fill-red-400'
                        : 'fill-transparent group-hover:stroke-gray-600',
                    iconClassName,
                )}
            />
        </IconButton>
    );
}

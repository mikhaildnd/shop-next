'use client';

import { Heart } from 'lucide-react';

import type { IconButtonProps } from '@/components/button/icon-button/icon-button.types';
import { IconButton } from '@/components/button/icon-button/IconButton';
import { useFavoritesContext } from '@/components/favorite/FavoritesContext';
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

    return (
        <IconButton
            {...props}
            useGroup
            aria-label={favorite ? 'Убрать из избранного' : 'В избранное'}
            onClick={() => toggleFavorite(productId)}
            className={className}
        >
            <Heart
                className={cn(
                    'stroke-red-500 stroke-[1.5px] transition-[fill,stroke] duration-150 group-active:stroke-red-400',
                    favorite
                        ? 'fill-red-500 group-active:fill-red-400'
                        : 'fill-transparent',
                    iconClassName,
                )}
            />
        </IconButton>
    );
}

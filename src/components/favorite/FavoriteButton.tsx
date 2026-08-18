'use client';

import { Heart } from 'lucide-react';

import { useFavoritesContext } from '@/components/favorite/FavoritesContext';
import { cn } from '@/lib/cn';

interface FavoriteButtonProps {
    productId: string;
}

export function FavoriteButton({ productId }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite } = useFavoritesContext();

    const favorite = isFavorite(productId);

    return (
        <button
            type="button"
            aria-label={favorite ? 'Убрать из избранного' : 'В избранное'}
            onClick={() => toggleFavorite(productId)}
            className="group absolute top-2 right-2 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white opacity-80 focus-ring"
        >
            <Heart
                className={cn(
                    'size-5.5 stroke-red-500 stroke-[1.5px] transition-[fill] duration-150 group-active:stroke-red-400',
                    favorite
                        ? 'fill-red-500 group-active:fill-red-400'
                        : 'fill-transparent',
                )}
            />
        </button>
    );
}

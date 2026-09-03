'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';

import { useFavoritesContext } from '@/components/favorite/FavoritesContext';
import { cn } from '@/lib/cn';
import { routes } from '@/routes';

interface FavoritesNavigationItemProps {
    className?: string;
}

export function FavoritesNavigationItem({
    className,
}: FavoritesNavigationItemProps) {
    const { favoriteCount } = useFavoritesContext();

    return (
        <Link
            className={cn(
                'flex cursor-pointer flex-col items-center gap-1.5 p-1',
                className,
            )}
            href={routes.favoritesPage()}
        >
            <div className="relative">
                <Heart
                    aria-label="Избранное"
                    className="size-5.5 stroke-[1.5px] transition-[fill] duration-150"
                />

                {favoriteCount > 0 && (
                    <span className="absolute -top-2 left-[calc(50%+4px)] flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-primary) px-1 text-xs text-white">
                        {favoriteCount}
                    </span>
                )}
            </div>

            <span className="text-xs">Избранное</span>
        </Link>
    );
}

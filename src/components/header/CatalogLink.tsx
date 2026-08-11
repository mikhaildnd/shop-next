'use client';

import { LayoutGrid } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';

import { ButtonLink } from '@/components/shared/button/ButtonLink';
import { routes } from '@/lib/routes';
import { cn } from '@/utils/cn';

interface CatalogLinkProps {
    className?: string;
}

export function CatalogLink({ className }: CatalogLinkProps) {
    const pathname = usePathname();
    const isCurrentPath = pathname === routes.catalogPage();

    const router = useRouter();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (isCurrentPath) {
            e.preventDefault();

            router.back();
        }
    };

    return (
        <ButtonLink
            className={cn('flex items-center gap-2 px-4', className)}
            href={routes.catalogPage()}
            onClick={handleClick}
            aria-current={isCurrentPath ? 'page' : undefined}
        >
            <LayoutGrid
                className={cn(
                    'size-5 stroke-[1.5px] text-white',
                    isCurrentPath && 'fill-white',
                )}
            />
            <span>Каталог</span>
        </ButtonLink>
    );
}

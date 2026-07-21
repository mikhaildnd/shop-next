'use client';

import { LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';

import { routes } from '@/lib/routes';
import { cn } from '@/utils/cn';

interface CatalogLinkProps {
    className?: string;
}

export function CatalogLink({ className }: CatalogLinkProps) {
    const pathname = usePathname();
    const isCurrentPath = pathname === routes.catalogPage();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (isCurrentPath) {
            e.preventDefault();
        }
    };

    return (
        <Link
            className={cn(
                'flex items-center gap-2 rounded bg-(--color-primary) px-4 py-2 transition-all duration-300',
                'hover:shadow-(--shadow-button-default)',
                'active:shadow-(--shadow-button-active)',
                'focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_var(--color-primary)] focus-visible:outline-none',
                className,
            )}
            href={routes.catalogPage()}
            onClick={handleClick}
            aria-current={isCurrentPath ? 'page' : undefined}
        >
            <LayoutGrid className="size-5 stroke-[1.5px] text-white" />
            <span className="text-base text-white">Каталог</span>
        </Link>
    );
}

import { LayoutGrid } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/lib/routes';
import { cn } from '@/utils/cn';

interface CatalogLinkProps {
    className?: string;
}

export function CatalogLink({ className }: CatalogLinkProps) {
    return (
        <Link
            className={cn(
                'flex items-center gap-2 rounded bg-(--color-primary) px-4 py-2 duration-300 hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active)',
                className,
            )}
            href={routes.catalogPage()}
        >
            <LayoutGrid className="size-5 stroke-[1.5px] text-white" />
            <span className="text-base text-white">Каталог</span>
        </Link>
    );
}

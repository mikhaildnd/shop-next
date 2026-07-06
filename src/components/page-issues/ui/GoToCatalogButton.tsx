'use client';

import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';

export function GoToCatalogButton() {
    const router = useRouter();

    function handleClick() {
        router.replace(routes.catalogPage(), {
            scroll: false,
        });
    }

    return (
        <button
            onClick={handleClick}
            className="flex cursor-pointer items-center justify-center gap-2 bg-(--color-primary) px-4 py-3 text-white transition-opacity hover:opacity-90"
        >
            В каталог
        </button>
    );
}

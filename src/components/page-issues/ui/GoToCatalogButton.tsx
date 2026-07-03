'use client';

import { usePathname, useRouter } from 'next/navigation';

export function GoToCatalogButton() {
    const router = useRouter();
    const pathname = usePathname();

    function handleClick() {
        router.replace(pathname, {
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

'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/button/Button';
import { routes } from '@/routes';

export function GoToCatalogButton() {
    const router = useRouter();

    function handleClick() {
        router.replace(routes.catalogPage(), {
            scroll: false,
        });
    }

    return <Button onClick={handleClick}>В каталог</Button>;
}

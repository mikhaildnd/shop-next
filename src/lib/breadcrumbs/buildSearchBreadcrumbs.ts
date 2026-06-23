import { routes } from '@/lib/routes';
import type { BreadcrumbItem } from '@/lib/breadcrumbs/types';

export function buildSearchBreadcrumbs(): BreadcrumbItem[] {
    return [
        {
            label: 'Главная',
            href: routes.home(),
        },
        {
            label: 'Поиск',
            href: '/search',
        },
    ];
}

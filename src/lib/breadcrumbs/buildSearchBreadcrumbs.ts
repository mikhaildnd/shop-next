import type { BreadcrumbItem } from '@/lib/breadcrumbs/types';
import { routes } from '@/lib/routes';

export function buildSearchBreadcrumbs(): BreadcrumbItem[] {
    return [
        {
            label: 'Главная',
            href: routes.homePage(),
        },
        {
            label: 'Поиск',
            href: routes.searchPage(),
        },
    ];
}

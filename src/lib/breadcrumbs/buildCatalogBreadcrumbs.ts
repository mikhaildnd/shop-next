import type { BreadcrumbItem } from '@/components/breadcrumbs/Breadcrumbs';
import { routes } from '@/lib/routes';

type BuildCatalogBreadcrumbsParams = {
    category?: {
        title: string;
        slug: string;
    };
};

export function buildCatalogBreadcrumbs({
    category,
}: BuildCatalogBreadcrumbsParams = {}): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [
        {
            label: 'Главная',
            href: routes.home(),
        },

        {
            label: 'Каталог',
            href: routes.catalog(),
        },
    ];

    if (category) {
        items.push({
            label: category.title,
        });
    }

    return items;
}

import type { BreadcrumbItem } from '@/components/breadcrumbs/Breadcrumbs';
import { routes } from '@/lib/routes';
import type { ProductCategoryDto } from '@/types/product';

type BuildCatalogBreadcrumbsParams = {
    category?: ProductCategoryDto;
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

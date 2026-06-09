import { routes } from '@/lib/routes';
import type { BreadcrumbItem } from '@/lib/breadcrumbs/types';

type CategoryBreadcrumb = {
    slug: string;
    title: string;
};

type BuildCatalogBreadcrumbsParams = {
    categoryPath: CategoryBreadcrumb[];
};

export function buildCatalogBreadcrumbs({
    categoryPath,
}: BuildCatalogBreadcrumbsParams): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [
        {
            label: 'Главная',
            href: routes.home(),
        },
    ];

    categoryPath.forEach((category, index) => {
        const isLast = index === categoryPath.length - 1;

        items.push({
            label: category.title,

            href: isLast ? undefined : routes.category(category.slug),
        });
    });

    return items;
}

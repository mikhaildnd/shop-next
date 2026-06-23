import { routes } from '@/lib/routes';
import type { BreadcrumbItem } from '@/lib/breadcrumbs/types';
import type { CategoryDto } from '@/services/category/category.types';

type BuildCatalogBreadcrumbsParams = {
    categoryPath: Pick<CategoryDto, 'slug' | 'title'>[];
};

export function buildCatalogBreadcrumbs({
    categoryPath,
}: BuildCatalogBreadcrumbsParams): BreadcrumbItem[] {
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

    categoryPath.forEach((category, index) => {
        const isLast = index === categoryPath.length - 1;

        items.push({
            label: category.title,

            href: isLast ? undefined : routes.category(category.slug),
        });
    });

    return items;
}

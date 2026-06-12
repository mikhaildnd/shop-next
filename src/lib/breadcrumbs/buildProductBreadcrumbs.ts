import { routes } from '@/lib/routes';
import type { BreadcrumbItem } from '@/lib/breadcrumbs/types';

type CategoryBreadcrumb = {
    slug: string;
    title: string;
};

type BuildProductBreadcrumbsParams = {
    categoryPath: CategoryBreadcrumb[];
    product: {
        title: string;
    };
};

export function buildProductBreadcrumbs({
    categoryPath,
    product,
}: BuildProductBreadcrumbsParams): BreadcrumbItem[] {
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

    categoryPath.forEach((category) => {
        items.push({
            label: category.title,

            href: routes.category(category.slug),
        });
    });

    items.push({
        label: product.title,
    });

    return items;
}

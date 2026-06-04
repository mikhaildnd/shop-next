import type { BreadcrumbItem } from '@/components/breadcrumbs/Breadcrumbs';
import { routes } from '@/lib/routes';
import type { ProductCategoryDto } from '@/types/product';

type BuildProductBreadcrumbsParams = {
    category?: ProductCategoryDto;
    product: {
        title: string;
    };
};

export function buildProductBreadcrumbs({
    category,
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

    if (category) {
        items.push({
            label: category.title,
            href: routes.category(category.slug),
        });
    }

    items.push({
        label: product.title,
    });

    return items;
}

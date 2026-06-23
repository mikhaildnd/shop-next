import { routes } from '@/lib/routes';
import type { BreadcrumbItem } from '@/lib/breadcrumbs/types';
import type { CategoryDto } from '@/services/category/category.types';
import type { ProductDto } from '@/services/product/product.types';

type BuildProductBreadcrumbsParams = {
    categoryPath: Pick<CategoryDto, 'slug' | 'title'>[];
    product: Pick<ProductDto, 'title'>;
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

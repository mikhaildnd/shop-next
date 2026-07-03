import type { BreadcrumbItem } from '@/lib/breadcrumbs/types';
import { routes } from '@/lib/routes';
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
            href: routes.homePage(),
        },
        {
            label: 'Каталог',
            href: routes.catalogPage(),
        },
    ];

    categoryPath.forEach((category) => {
        items.push({
            label: category.title,

            href: routes.categoryPage(category.slug),
        });
    });

    items.push({
        label: product.title,
    });

    return items;
}

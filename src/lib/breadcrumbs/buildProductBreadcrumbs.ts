import type { BreadcrumbItem } from '@/components/breadcrumbs/Breadcrumbs';

type BuildProductBreadcrumbsParams = {
    category?: {
        title: string;
        slug: string;
    };

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
            href: '/',
        },

        {
            label: 'Каталог',
            href: '/catalog',
        },
    ];

    if (category) {
        items.push({
            label: category.title,
            href: `/catalog?category=${category.slug}`,
        });
    }

    items.push({
        label: product.title,
    });

    return items;
}

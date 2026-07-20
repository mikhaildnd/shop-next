import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CatalogLayout } from '@/app/(shop)/(catalog)/catalog/_components/CatalogLayout';
import { Breadcrumbs } from '@/components/breadcrumbs/Breadcrumbs';
import { routes } from '@/lib/routes';
import { getCategories } from '@/services/category/category.service';

export const metadata: Metadata = {
    title: 'Каталог товаров',
    description: 'Каталог товаров интернет-магазина',
};

export default async function CatalogPage() {
    const categories = await getCategories();

    if (!categories.length) {
        notFound();
    }

    const breadcrumbs = [
        {
            label: 'Главная',
            href: routes.homePage(),
        },
        {
            label: 'Каталог',
            href: routes.catalogPage(),
        },
    ];

    return (
        <div className="page-spacing">
            <Breadcrumbs
                items={breadcrumbs}
                className="py-4"
            />
            <h1 className="mb-3 catalog-heading xl:mb-5">Каталог товаров</h1>

            <CatalogLayout categories={categories} />
        </div>
    );
}

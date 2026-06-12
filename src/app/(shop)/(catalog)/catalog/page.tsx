import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategories } from '@/services/category/category.service';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import { routes } from '@/lib/routes';
import CategoryCard from '@/app/(shop)/(catalog)/catalog/_components/CategoryCard';

export const metadata: Metadata = {
    title: 'Каталог товаров',
    description: 'Каталог товаров интернет-магазина',
};

export default async function Page() {
    const categories = await getCategories();

    // Страница не существует
    if (!categories.length) {
        notFound();
    }

    const rootCategories = categories.filter(
        (category) => category.parentId === null,
    );

    const categoryCards = rootCategories.map((category) => ({
        category,
        childCategories: categories.filter(
            (childCategory) => childCategory.parentId === category.id,
        ),
    }));

    const breadcrumbs = [
        {
            label: 'Главная',
            href: routes.home(),
        },
        {
            label: 'Каталог',
            href: routes.catalog(),
        },
    ];

    return (
        <div className="page-spacing">
            <Breadcrumbs
                items={breadcrumbs}
                className="py-4"
            />
            <h1 className="mb-2 catalog-heading xl:mb-3">Каталог товаров</h1>

            <div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryCards.map(({ category, childCategories }) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            childCategories={childCategories}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CatalogPageLayout } from '@/app/(shop)/(catalog)/_components/CatalogPageLayout';
import { CategoryPageContent } from '@/app/(shop)/(catalog)/catalog/[categorySlug]/_components/CategoryPageContent';
import { CategoryTags } from '@/app/(shop)/(catalog)/catalog/[categorySlug]/_components/CategoryTags';
import { buildCatalogBreadcrumbs } from '@/app/(shop)/(catalog)/catalog/[categorySlug]/lib/build-catalog-breadcrumbs';
import { getDescendantCategorySlugs } from '@/app/(shop)/(catalog)/catalog/[categorySlug]/lib/get-descendant-category-slugs';
import { getCategoryPath } from '@/app/(shop)/(catalog)/lib/get-category-path';
import type { ProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import {
    getCategories,
    getCategoryBySlug,
} from '@/services/category/category.service';
import type { CategoryDto } from '@/services/category/category.types';

interface CategoryPageProps {
    params: Promise<{
        categorySlug: string;
    }>;

    searchParams: Promise<ProductListingSearchParams>;
}

export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
    const { categorySlug: slug } = await params;

    const category: CategoryDto | null = await getCategoryBySlug(slug);

    if (!category) {
        return {
            title: 'Категория не найдена',
        };
    }

    return {
        title: category.title,
        description: `Каталог | ${category.title}`,
    };
}

export default async function CategoryPage({
    params,
    searchParams,
}: CategoryPageProps) {
    const [{ categorySlug: slug }, query] = await Promise.all([
        params,
        searchParams,
    ]);

    const categories = await getCategories();
    const category = categories.find((category) => category.slug === slug);

    if (!category) {
        notFound();
    }

    const categoryPath = getCategoryPath(categories, category.id);
    const breadcrumbs = buildCatalogBreadcrumbs({
        categoryPath,
    });
    const childCategories = categories.filter(
        (childCategory) => childCategory.parentId === category.id,
    );
    const tags = <CategoryTags categories={childCategories} />;
    const categorySlugs = getDescendantCategorySlugs(categories, category.id);

    return (
        <CatalogPageLayout
            title={category.title}
            breadcrumbs={breadcrumbs}
            tags={tags}
        >
            <CategoryPageContent
                params={query}
                categorySlugs={categorySlugs}
            />
        </CatalogPageLayout>
    );
}

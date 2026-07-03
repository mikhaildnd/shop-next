import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts } from '@/services/product/product.service';
import {
    getCategoryBySlug,
    getCategories,
} from '@/services/category/category.service';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import ProductsListContent from '@/app/(shop)/(catalog)/_components/ProductsListContent';
import { buildCatalogBreadcrumbs } from '@/lib/breadcrumbs/buildCatalogBreadcrumbs';
import { getDescendantCategorySlugs } from '@/lib/category/get-descendant-category-slugs';
import { getCategoryPath } from '@/lib/category/get-category-path';
import CategoryTags from '@/components/shared/CategoryTags';
import ProductListingLayout from '@/app/(shop)/(catalog)/_components/layouts/ProductListingLayout';
import { PRODUCTS_PER_PAGE } from '@/lib/product-listing/consts';
import type { ProductListingSearchParams } from '@/lib/product-listing/types';
import { parseProductListing } from '@/lib/product-listing/parse-product-listing';
import { PageIssues } from '@/components/page-issues/ui/PageIssues';
import { InvalidPageState } from '@/app/(shop)/(catalog)/_components/page-states/InvalidPageState';
import { EmptyProductState } from '@/app/(shop)/(catalog)/_components/page-states/EmptyProductState';
import { PageStateLayout } from '@/app/(shop)/(catalog)/_components/layouts/PageStateLayout';
import { CollectionProductsSection } from '@/app/(shop)/(catalog)/_components/CollectionProductsSection';

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

    const category = await getCategoryBySlug(slug);

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

    const listing = parseProductListing(query);

    const pagination = getPaginationParams({
        searchParams: query,
        limit: PRODUCTS_PER_PAGE,
    });

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

    const hasIssues = listing.issues.length > 0 || pagination.issues.length > 0;

    if (hasIssues) {
        return (
            <PageStateLayout
                title={category.title}
                breadcrumbs={breadcrumbs}
                tags={tags}
            >
                <PageIssues
                    listingIssues={listing.issues}
                    paginationIssues={pagination.issues}
                />

                <CollectionProductsSection collectionSlug="promotion" />
            </PageStateLayout>
        );
    }

    const { products, filteredProductsCount, listingStats } = await getProducts(
        {
            take: pagination.take,
            skip: pagination.skip,
            categorySlugs,
            filters: listing.filters,
            sort: listing.sort,
        },
    );

    const totalPages = Math.ceil(filteredProductsCount / PRODUCTS_PER_PAGE);

    if (pagination.currentPage > totalPages && filteredProductsCount > 0) {
        return (
            <PageStateLayout
                title={category.title}
                breadcrumbs={breadcrumbs}
                tags={tags}
            >
                <InvalidPageState />
                <CollectionProductsSection collectionSlug="promotion" />
            </PageStateLayout>
        );
    }

    if (filteredProductsCount === 0) {
        return (
            <PageStateLayout
                title={category.title}
                breadcrumbs={breadcrumbs}
            >
                <EmptyProductState description="Попробуйте открыть другую категорию" />

                <CollectionProductsSection collectionSlug="promotion" />
            </PageStateLayout>
        );
    }

    return (
        <ProductListingLayout
            sort={listing.sort}
            listingStats={listingStats}
            filteredProductsCount={filteredProductsCount}
            breadcrumbs={breadcrumbs}
            title={category.title}
            tags={tags}
        >
            <ProductsListContent
                products={products}
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                startPage={pagination.startPage}
            />
        </ProductListingLayout>
    );
}

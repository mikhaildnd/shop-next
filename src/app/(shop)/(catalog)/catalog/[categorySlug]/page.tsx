import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getProducts } from '@/services/product/product.service';
import {
    getCategoryBySlug,
    getCategories,
} from '@/services/category/category.service';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import ProductsListEmpty from '@/app/(shop)/(catalog)/_components/ProductsListEmpty';
import ProductsListContent from '@/app/(shop)/(catalog)/_components/ProductsListContent';
import { buildCatalogBreadcrumbs } from '@/lib/breadcrumbs/buildCatalogBreadcrumbs';
import { routes } from '@/lib/routes';
import { getDescendantCategorySlugs } from '@/lib/category/get-descendant-category-slugs';
import { getCategoryPath } from '@/lib/category/get-category-path';
import CategoryTags from '@/components/shared/CategoryTags';
import { buildSearchParams } from '@/lib/url/build-search-params';
import ProductListingLayout from '@/app/(shop)/(catalog)/_components/ProductListingLayout';
import { PRODUCTS_PER_PAGE } from '@/lib/product-listing/consts';
import { getCanonicalPaginationSearchParams } from '@/lib/pagination/get-canonical-pagination-search-params';
import type { ProductListingSearchParams } from '@/lib/product-listing/types';
import { getCanonicalProductSearchParams } from '@/lib/product-listing/canonical/get-canonical-product-search-params';
import { parseProductListing } from '@/lib/product-listing/parse-product-listing';

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

    const { filters, sort } = parseProductListing(query);

    const canonicalSearch = buildSearchParams({
        params: {
            ...getCanonicalPaginationSearchParams(query),
            ...getCanonicalProductSearchParams(query),
        },
    });
    const currentSearch = buildSearchParams({
        params: query,
    });

    if (canonicalSearch !== currentSearch) {
        redirect(`${routes.categoryPage(slug)}${canonicalSearch}`);
    }

    const categories = await getCategories();
    const category = categories.find((category) => category.slug === slug);

    if (!category) {
        notFound();
    }

    const categoryPath = getCategoryPath(categories, category.id);
    const categorySlugs = getDescendantCategorySlugs(categories, category.id);
    const childCategories = categories.filter(
        (childCategory) => childCategory.parentId === category.id,
    );

    const { currentPage, startPage, take, skip } = getPaginationParams({
        searchParams: query,
        limit: PRODUCTS_PER_PAGE,
    });

    const { products, filteredProductsCount, filtersMeta } = await getProducts({
        take,
        skip,
        categorySlugs,
        filters,
        sort,
    });

    const totalPages = Math.ceil(filteredProductsCount / PRODUCTS_PER_PAGE);

    if (totalPages > 0 && currentPage > totalPages) {
        notFound();
    }

    const breadcrumbs = buildCatalogBreadcrumbs({
        categoryPath,
    });

    const tags = <CategoryTags categories={childCategories} />;

    return (
        <ProductListingLayout
            filtersMeta={filtersMeta}
            filteredProductsCount={filteredProductsCount}
            breadcrumbs={breadcrumbs}
            title={category.title}
            tags={tags}
        >
            {filteredProductsCount === 0 ? (
                <ProductsListEmpty
                    title="Товары не найдены"
                    description="Попробуйте открыть другую категорию"
                />
            ) : (
                <ProductsListContent
                    products={products}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    startPage={startPage}
                    getProductHref={(product) =>
                        routes.productInCategory(product.slug, slug)
                    }
                />
            )}
        </ProductListingLayout>
    );
}

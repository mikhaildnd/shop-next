import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
import ProductListingLayout from '@/app/(shop)/(catalog)/_components/ProductListingLayout';
import { PRODUCTS_PER_PAGE } from '@/lib/product-listing/consts';
import type { ProductListingSearchParams } from '@/lib/product-listing/types';
import { parseProductListing } from '@/lib/product-listing/parse-product-listing';
import { PAGINATION_ISSUES } from '@/lib/pagination/consts';
import { PRODUCT_FILTER_LISTING_ISSUES } from '@/lib/product-listing/filters/consts';
import { PRODUCT_SORT_LISTING_ISSUES } from '@/lib/product-listing/sort/consts';
import ProductListingIssue from '@/components/product/productFilters/ProductListingIssue';

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
    const categorySlugs = getDescendantCategorySlugs(categories, category.id);
    const childCategories = categories.filter(
        (childCategory) => childCategory.parentId === category.id,
    );

    if (pagination.issues.includes(PAGINATION_ISSUES.INVALID_PAGE)) {
        return (
            <ProductListingIssue
                title="Неверный параметр страницы"
                description="Попробуйте обновить или сбросить фильтры"
            />
        );
    }

    if (pagination.issues.includes(PAGINATION_ISSUES.FROM_GREATER_THAN_PAGE)) {
        return (
            <ProductListingIssue
                title="Неверный параметр страницы"
                description="Попробуйте обновить или сбросить фильтры"
            />
        );
    }

    if (pagination.issues.includes(PAGINATION_ISSUES.INVALID_FROM)) {
        return (
            <ProductListingIssue
                title="Неверный параметр страницы"
                description="Попробуйте обновить или сбросить фильтры"
            />
        );
    }

    if (pagination.issues.includes(PAGINATION_ISSUES.INVALID_VIEW)) {
        return (
            <ProductListingIssue
                title="Неверный параметр страницы"
                description="Попробуйте обновить или сбросить фильтры"
            />
        );
    }

    if (pagination.issues.includes(PAGINATION_ISSUES.FROM_WITHOUT_APPEND)) {
        return (
            <ProductListingIssue
                title="Неверный параметр страницы"
                description="Попробуйте обновить или сбросить фильтры"
            />
        );
    }

    if (listing.issues.includes(PRODUCT_SORT_LISTING_ISSUES.INVALID_SORT)) {
        return (
            <ProductListingIssue
                title="Неверный параметр сортировки"
                description="Попробуйте обновить или сбросить фильтры"
            />
        );
    }

    if (listing.issues.includes(PRODUCT_FILTER_LISTING_ISSUES.INVALID_SALE)) {
        return (
            <ProductListingIssue
                title="Неверный параметр фильтрации"
                description="Попробуйте обновить или сбросить фильтры"
            />
        );
    }
    if (
        listing.issues.includes(PRODUCT_FILTER_LISTING_ISSUES.INVALID_DISCOUNT)
    ) {
        return (
            <ProductListingIssue
                title="Неверный параметр фильтрации"
                description="Попробуйте обновить или сбросить фильтры"
            />
        );
    }

    if (
        listing.issues.includes(
            PRODUCT_FILTER_LISTING_ISSUES.INVALID_PRICE_FROM,
        )
    ) {
        return (
            <ProductListingIssue
                title="Неверный параметр фильтрации"
                description="Попробуйте обновить или сбросить фильтры"
            />
        );
    }

    if (
        listing.issues.includes(PRODUCT_FILTER_LISTING_ISSUES.INVALID_PRICE_TO)
    ) {
        return (
            <ProductListingIssue
                title="Неверный параметр фильтрации"
                description="Попробуйте обновить или сбросить фильтры"
            />
        );
    }

    if (
        listing.issues.includes(PRODUCT_FILTER_LISTING_ISSUES.INVALID_IN_STOCK)
    ) {
        return (
            <ProductListingIssue
                title="Неверный параметр фильтрации"
                description="Попробуйте обновить или сбросить фильтры"
            />
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
            <ProductListingIssue
                title="Такой страницы не существует"
                description="Попробуйте обновить или сбросить фильтры"
            />
        );
    }

    const breadcrumbs = buildCatalogBreadcrumbs({
        categoryPath,
    });

    const tags = <CategoryTags categories={childCategories} />;

    return (
        <ProductListingLayout
            sort={listing.sort}
            listingStats={listingStats}
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
                    currentPage={pagination.currentPage}
                    totalPages={totalPages}
                    startPage={pagination.startPage}
                    getProductHref={(product) =>
                        routes.productInCategory(product.slug, slug)
                    }
                />
            )}
        </ProductListingLayout>
    );
}

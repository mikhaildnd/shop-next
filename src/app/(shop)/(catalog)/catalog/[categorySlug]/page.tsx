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

// TODO: restore canonical redirect after serializer refactor.

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

    const { currentPage, startPage, take, skip, issues } = getPaginationParams({
        searchParams: query,
        limit: PRODUCTS_PER_PAGE,
    });

    if (issues.includes(PAGINATION_ISSUES.INVALID_PAGE)) {
        return <div>InvalidPaginationState: INVALID PAGE</div>;
    }

    if (issues.includes(PAGINATION_ISSUES.INVALID_FROM)) {
        return <div>InvalidPaginationState: INVALID_FROM</div>;
    }

    if (issues.includes(PAGINATION_ISSUES.INVALID_VIEW)) {
        return <div>InvalidPaginationState: INVALID_VIEW</div>;
    }

    if (issues.includes(PAGINATION_ISSUES.FROM_WITHOUT_APPEND)) {
        return <div>InvalidPaginationState: FROM_WITHOUT_APPEND</div>;
    }

    if (listing.issues.includes(PRODUCT_SORT_LISTING_ISSUES.INVALID_SORT)) {
        return <div>InvalidSortState</div>;
    }

    if (listing.issues.includes(PRODUCT_FILTER_LISTING_ISSUES.INVALID_SALE)) {
        return <div>InvalidSale</div>;
    }
    if (
        listing.issues.includes(PRODUCT_FILTER_LISTING_ISSUES.INVALID_DISCOUNT)
    ) {
        return <div>InvalidDiscount</div>;
    }

    if (
        listing.issues.includes(
            PRODUCT_FILTER_LISTING_ISSUES.INVALID_PRICE_FROM,
        )
    ) {
        return <div>InvalidPriceFrom</div>;
    }

    if (
        listing.issues.includes(PRODUCT_FILTER_LISTING_ISSUES.INVALID_PRICE_TO)
    ) {
        return <div>InvalidPriceTo</div>;
    }

    if (
        listing.issues.includes(PRODUCT_FILTER_LISTING_ISSUES.INVALID_IN_STOCK)
    ) {
        return <div>InvalidInStock</div>;
    }

    const { products, filteredProductsCount, filtersMeta } = await getProducts({
        take,
        skip,
        categorySlugs,
        filters: listing.filters,
        sort: listing.sort,
    });

    const totalPages = Math.ceil(filteredProductsCount / PRODUCTS_PER_PAGE);

    if (currentPage > totalPages && filteredProductsCount > 0) {
        return <div>PageOutOfRangeState</div>;
    }

    const breadcrumbs = buildCatalogBreadcrumbs({
        categoryPath,
    });

    const tags = <CategoryTags categories={childCategories} />;

    return (
        <ProductListingLayout
            sort={listing.sort}
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

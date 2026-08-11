import { CollectionProductsSection } from '@/app/(shop)/(catalog)/_components/CollectionProductsSection';
import { PageStateLayout } from '@/app/(shop)/(catalog)/_components/layouts/PageStateLayout';
import { ProductListingLayout } from '@/app/(shop)/(catalog)/_components/layouts/ProductListingLayout';
import { EmptyProductState } from '@/app/(shop)/(catalog)/_components/page-states/EmptyProductState';
import { InvalidPageState } from '@/app/(shop)/(catalog)/_components/page-states/InvalidPageState';
import { ProductsListContent } from '@/app/(shop)/(catalog)/_components/ProductsListContent';
import { IssueMessage } from '@/components/page-issues/ui/IssueMessage';
import { PageIssues } from '@/components/page-issues/ui/PageIssues';
import { buildSearchBreadcrumbs } from '@/lib/breadcrumbs/buildSearchBreadcrumbs';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { PRODUCTS_PER_PAGE } from '@/lib/product-listing/consts';
import { parseProductListing } from '@/lib/product-listing/parse-product-listing';
import type { ProductListingSearchParams } from '@/lib/product-listing/types';
import { SEARCH_QUERY_PARAM } from '@/lib/search/consts';
import { normalizeSearchQuery } from '@/lib/search/normalize-search-query';
import { getProducts } from '@/services/product/product.service';

interface SearchPageProps {
    searchParams: Promise<ProductListingSearchParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const state = normalizeSearchQuery(params[SEARCH_QUERY_PARAM]);

    const breadcrumbs = buildSearchBreadcrumbs();

    if (state.status === 'empty') {
        return (
            <PageStateLayout
                title="Результаты поиска"
                breadcrumbs={breadcrumbs}
            >
                <IssueMessage
                    title="Не указана строка поиска"
                    description="Введите название товара или категории"
                />

                <CollectionProductsSection collectionSlug="promotion" />
            </PageStateLayout>
        );
    }

    if (state.status === 'too-short') {
        return (
            <PageStateLayout
                title="Результаты поиска"
                breadcrumbs={breadcrumbs}
            >
                <IssueMessage
                    title="Слишком короткий запрос"
                    description="Минимум 2 символа"
                />

                <CollectionProductsSection collectionSlug="promotion" />
            </PageStateLayout>
        );
    }

    const listing = parseProductListing(params);

    const pagination = getPaginationParams({
        searchParams: params,
        limit: PRODUCTS_PER_PAGE,
    });

    if (listing.issues.length > 0 || pagination.issues.length > 0) {
        return (
            <PageStateLayout
                title="Результаты поиска"
                breadcrumbs={breadcrumbs}
            >
                <PageIssues
                    listingIssues={listing.issues}
                    paginationIssues={pagination.issues}
                />

                <CollectionProductsSection collectionSlug="promotion" />
            </PageStateLayout>
        );
    }

    const { products, totalProductsCount, listingStats } = await getProducts({
        take: pagination.take,
        skip: pagination.skip,
        filters: listing.filters,
        sort: listing.sort,
    });

    const totalPages = Math.max(
        1,
        Math.ceil(totalProductsCount / PRODUCTS_PER_PAGE),
    );

    if (pagination.currentPage > totalPages && totalProductsCount > 0) {
        return (
            <PageStateLayout
                title="Результаты поиска"
                breadcrumbs={breadcrumbs}
            >
                <InvalidPageState />

                <CollectionProductsSection collectionSlug="promotion" />
            </PageStateLayout>
        );
    }

    if (totalProductsCount === 0) {
        return (
            <PageStateLayout
                title="Результаты поиска"
                breadcrumbs={breadcrumbs}
            >
                <EmptyProductState
                    description={`По запросу "${state.query}" ничего не найдено`}
                />

                <CollectionProductsSection collectionSlug="promotion" />
            </PageStateLayout>
        );
    }

    return (
        <ProductListingLayout
            sort={listing.sort}
            listingStats={listingStats}
            title="Результаты поиска"
            breadcrumbs={breadcrumbs}
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

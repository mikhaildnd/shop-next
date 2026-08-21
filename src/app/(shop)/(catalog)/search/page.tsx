import { CatalogPageLayout } from '@/app/(shop)/(catalog)/_components/CatalogPageLayout';
import { CollectionProductsSection } from '@/app/(shop)/(catalog)/_components/CollectionProductsSection';
import { IssueMessage } from '@/app/(shop)/(catalog)/_components/page-issues/IssueMessage';
import { PageIssues } from '@/app/(shop)/(catalog)/_components/page-issues/PageIssues';
import { EmptyProductState } from '@/app/(shop)/(catalog)/_components/page-states/EmptyProductState';
import { InvalidPageState } from '@/app/(shop)/(catalog)/_components/page-states/InvalidPageState';
import { ProductListing } from '@/app/(shop)/(catalog)/_components/ProductListing';
import { parseProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/parse-product-listing';
import { PRODUCTS_PER_PAGE } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { getSession } from '@/auth/session';
import type { BreadcrumbItem } from '@/components/breadcrumbs/breadcrumbs.types';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { normalizeSearchQuery } from '@/lib/search/normalize-search-query';
import { SEARCH_QUERY_PARAM } from '@/lib/search/search.constants';
import { routes } from '@/routes';
import { getProductsForListing } from '@/services/product/use-cases/get-products-for-listing';

interface SearchPageProps {
    searchParams: Promise<ProductListingSearchParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const state = normalizeSearchQuery(params[SEARCH_QUERY_PARAM]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            label: 'Главная',
            href: routes.homePage(),
        },
        {
            label: 'Поиск',
        },
    ];

    if (state.status === 'empty') {
        return (
            <CatalogPageLayout
                title="Результаты поиска"
                breadcrumbs={breadcrumbs}
            >
                <IssueMessage
                    title="Не указана строка поиска"
                    description="Введите название товара или категории"
                />

                <CollectionProductsSection collectionSlug="promotion" />
            </CatalogPageLayout>
        );
    }

    if (state.status === 'too-short') {
        return (
            <CatalogPageLayout
                title="Результаты поиска"
                breadcrumbs={breadcrumbs}
            >
                <IssueMessage
                    title="Слишком короткий запрос"
                    description="Минимум 2 символа"
                />

                <CollectionProductsSection collectionSlug="promotion" />
            </CatalogPageLayout>
        );
    }

    const listing = parseProductListing(params);

    const pagination = getPaginationParams({
        searchParams: params,
        limit: PRODUCTS_PER_PAGE,
    });

    if (listing.issues.length > 0 || pagination.issues.length > 0) {
        return (
            <CatalogPageLayout
                title="Результаты поиска"
                breadcrumbs={breadcrumbs}
            >
                <PageIssues
                    listingIssues={listing.issues}
                    paginationIssues={pagination.issues}
                />

                <CollectionProductsSection collectionSlug="promotion" />
            </CatalogPageLayout>
        );
    }

    const session = await getSession();

    const { products, totalProductsCount, listingStats } =
        await getProductsForListing({
            userId: session?.user.id,
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
            <CatalogPageLayout
                title="Результаты поиска"
                breadcrumbs={breadcrumbs}
            >
                <InvalidPageState />

                <CollectionProductsSection collectionSlug="promotion" />
            </CatalogPageLayout>
        );
    }

    if (totalProductsCount === 0) {
        return (
            <CatalogPageLayout
                title="Результаты поиска"
                breadcrumbs={breadcrumbs}
            >
                <EmptyProductState
                    description={`По запросу "${state.query}" ничего не найдено`}
                />

                <CollectionProductsSection collectionSlug="promotion" />
            </CatalogPageLayout>
        );
    }

    return (
        <CatalogPageLayout
            title="Результаты поиска"
            breadcrumbs={breadcrumbs}
        >
            <ProductListing
                sort={listing.sort}
                listingStats={listingStats}
                products={products}
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                startPage={pagination.startPage}
            />
        </CatalogPageLayout>
    );
}

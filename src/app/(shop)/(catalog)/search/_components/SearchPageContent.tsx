import { PaginationIssues } from '@/app/(shop)/(catalog)/_components/page-issues/PaginationIssues';
import { ProductListingIssues } from '@/app/(shop)/(catalog)/_components/page-issues/ProductListingIssues';
import { InvalidPageState } from '@/app/(shop)/(catalog)/_components/page-states/InvalidPageState';
import { ProductListing } from '@/app/(shop)/(catalog)/_components/ProductListing';
import { ProductListingProvider } from '@/app/(shop)/(catalog)/_components/ProductListingContext';
import { getProductFilterDefaults } from '@/app/(shop)/(catalog)/lib/product-listing/get-product-filter-defaults';
import { getProductListingPageState } from '@/app/(shop)/(catalog)/lib/product-listing/get-product-listing-page-state';
import { parseProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/parse-product-listing';
import { PRODUCTS_PER_PAGE } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { ButtonLink } from '@/components/button/ButtonLink';
import { PageMessage } from '@/components/PageMessage';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { normalizeSearchQuery } from '@/lib/search/normalize-search-query';
import { SEARCH_QUERY_PARAM } from '@/lib/search/search.constants';
import { routes } from '@/routes';
import {
    getProductListingStats,
    getProducts,
} from '@/services/product/product.service';

interface SearchPageContentProps {
    params: ProductListingSearchParams;
}

export async function SearchPageContent({ params }: SearchPageContentProps) {
    const searchQuery = normalizeSearchQuery(params[SEARCH_QUERY_PARAM]);

    if (searchQuery.status !== 'success') {
        const message = {
            empty: {
                title: 'Не указана строка поиска',
                description: 'Введите название товара или категории',
            },
            'too-short': {
                title: 'Слишком короткий запрос',
                description: 'Минимум 2 символа',
            },
        }[searchQuery.status];

        return (
            <PageMessage
                title={message.title}
                description={message.description}
            />
        );
    }

    const listing = parseProductListing(params);
    const defaultFilters = getProductFilterDefaults();

    const pagination = getPaginationParams({
        searchParams: params,
        limit: PRODUCTS_PER_PAGE,
    });

    if (listing.issues.length > 0) {
        return <ProductListingIssues issues={listing.issues} />;
    }

    if (pagination.issues.length > 0) {
        return <PaginationIssues issues={pagination.issues} />;
    }

    const selection = {
        query: listing.query,
        filters: listing.filters,
    };

    const [productsResult, listingStats] = await Promise.all([
        getProducts({
            ...selection,
            take: pagination.take,
            skip: pagination.skip,
            sort: listing.sort,
        }),

        getProductListingStats(selection),
    ]);

    const { products, totalProductsCount } = productsResult;
    const totalPages = Math.ceil(totalProductsCount / PRODUCTS_PER_PAGE);

    const pageState = getProductListingPageState({
        currentPage: pagination.currentPage,
        totalPages,
        totalProductsCount,
    });

    if (pageState === 'invalid-page') {
        return <InvalidPageState />;
    }

    if (pageState === 'empty') {
        return (
            <PageMessage
                title="Товары не найдены"
                description={`По запросу "${searchQuery.query}" ничего не найдено`}
            >
                <ButtonLink href={routes.catalogPage()}>В каталог</ButtonLink>
            </PageMessage>
        );
    }

    return (
        <ProductListingProvider
            listingStats={listingStats}
            defaultFilters={defaultFilters}
        >
            <ProductListing
                products={products}
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                startPage={pagination.startPage}
            />
        </ProductListingProvider>
    );
}

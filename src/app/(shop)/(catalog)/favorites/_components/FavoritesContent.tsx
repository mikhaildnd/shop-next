import { PaginationIssues } from '@/app/(shop)/(catalog)/_components/page-issues/PaginationIssues';
import { ProductListingIssues } from '@/app/(shop)/(catalog)/_components/page-issues/ProductListingIssues';
import { InvalidPageState } from '@/app/(shop)/(catalog)/_components/page-states/InvalidPageState';
import { ProductListing } from '@/app/(shop)/(catalog)/_components/ProductListing';
import { ProductListingProvider } from '@/app/(shop)/(catalog)/_components/ProductListingContext';
import { FAVORITES_FILTER_DEFAULTS } from '@/app/(shop)/(catalog)/favorites/favorites.constants';
import { getProductFilterDefaults } from '@/app/(shop)/(catalog)/lib/product-listing/get-product-filter-defaults';
import { getProductListingPageState } from '@/app/(shop)/(catalog)/lib/product-listing/get-product-listing-page-state';
import { parseProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/parse-product-listing';
import { PRODUCTS_PER_PAGE } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { getSession } from '@/auth/session';
import { ButtonLink } from '@/components/button/ButtonLink';
import { PageMessage } from '@/components/PageMessage';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { routes } from '@/routes';
import { getFavoriteProductListing } from '@/services/product/product-listing.service';

interface FavoritesContentProps {
    params: ProductListingSearchParams;
}

export async function FavoritesContent({ params }: FavoritesContentProps) {
    const session = await getSession();

    if (!session) {
        return <EmptyFavoritesMessage />;
    }

    const listing = parseProductListing(params, {
        filterDefaults: FAVORITES_FILTER_DEFAULTS,
    });

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

    const { products, totalProductsCount, listingStats } =
        await getFavoriteProductListing({
            userId: session.user.id,
            query: listing.query,
            filters: listing.filters,
            sort: listing.sort,
            take: pagination.take,
            skip: pagination.skip,
        });

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
        return <EmptyFavoritesMessage />;
    }

    const defaultFilters = getProductFilterDefaults(FAVORITES_FILTER_DEFAULTS);

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

function EmptyFavoritesMessage() {
    return (
        <PageMessage
            title="В избранном пока ничего нет"
            description="Добавляйте понравившиеся товары, чтобы быстро найти их позже"
        >
            <ButtonLink href={routes.catalogPage()}>В каталог</ButtonLink>
        </PageMessage>
    );
}

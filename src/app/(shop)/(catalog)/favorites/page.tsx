import type { Metadata } from 'next';

import { CatalogPageLayout } from '@/app/(shop)/(catalog)/_components/CatalogPageLayout';
import { PageIssues } from '@/app/(shop)/(catalog)/_components/page-issues/PageIssues';
import { ProductListing } from '@/app/(shop)/(catalog)/_components/ProductListing';
import { parseProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/parse-product-listing';
import { PRODUCTS_PER_PAGE } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { getSession } from '@/auth/session';
import type { BreadcrumbItem } from '@/components/breadcrumbs/breadcrumbs.types';
import { ButtonLink } from '@/components/button/ButtonLink';
import { PageMessage } from '@/components/PageMessage';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { routes } from '@/routes';
import { getProducts } from '@/services/product/product.service';

import { FavoritesListing } from './_components/FavoritesListing';

interface FavoritesPageProps {
    searchParams: Promise<ProductListingSearchParams>;
}

export const metadata: Metadata = {
    title: 'Избранное',
};

export default async function FavoritesPage({
    searchParams,
}: FavoritesPageProps) {
    const query = await searchParams;

    const filterDefaults = {
        inStock: false,
    };

    const listing = parseProductListing(query, {
        defaultFilterOverrides: filterDefaults,
    });

    const pagination = getPaginationParams({
        searchParams: query,
        limit: PRODUCTS_PER_PAGE,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            label: 'Главная',
            href: routes.homePage(),
        },
        {
            label: 'Избранное',
        },
    ];

    const hasIssues = listing.issues.length > 0 || pagination.issues.length > 0;

    if (hasIssues) {
        return (
            <CatalogPageLayout
                title="Избранное"
                breadcrumbs={breadcrumbs}
            >
                <PageIssues
                    listingIssues={listing.issues}
                    paginationIssues={pagination.issues}
                />
            </CatalogPageLayout>
        );
    }

    const session = await getSession();

    if (session) {
        const result = await getProducts({
            ...listing,
            take: pagination.take,
            skip: pagination.skip,
            selectionScope: {
                favorites: {
                    some: {
                        userId: session.user.id,
                    },
                },
            },
        });

        const totalPages = Math.ceil(
            result.totalProductsCount / PRODUCTS_PER_PAGE,
        );

        return (
            <CatalogPageLayout
                title="Избранное"
                breadcrumbs={breadcrumbs}
            >
                {result.totalProductsCount === 0 ? (
                    <PageMessage
                        title="В избранном пока ничего нет"
                        description="Добавляйте понравившиеся товары, чтобы быстро найти их позже"
                    >
                        <ButtonLink href={routes.catalogPage()}>
                            В каталог
                        </ButtonLink>
                    </PageMessage>
                ) : (
                    <ProductListing
                        sort={listing.sort}
                        listingStats={result.listingStats}
                        products={result.products}
                        currentPage={pagination.currentPage}
                        totalPages={totalPages}
                        startPage={pagination.startPage}
                        defaultFilterOverrides={filterDefaults}
                    />
                )}
            </CatalogPageLayout>
        );
    }

    return (
        <CatalogPageLayout
            title="Избранное"
            breadcrumbs={breadcrumbs}
        >
            <FavoritesListing
                listing={listing}
                pagination={pagination}
                defaultFilterOverrides={filterDefaults}
            />
        </CatalogPageLayout>
    );
}

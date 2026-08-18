import type { Metadata } from 'next';

import { CatalogPageLayout } from '@/app/(shop)/(catalog)/_components/CatalogPageLayout';
import { PageIssues } from '@/app/(shop)/(catalog)/_components/page-issues/PageIssues';
import { parseProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/parse-product-listing';
import { PRODUCTS_PER_PAGE } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import type { BreadcrumbItem } from '@/components/breadcrumbs/breadcrumbs.types';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { routes } from '@/routes';

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

    const listing = parseProductListing(query);

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

    return (
        <CatalogPageLayout
            title="Избранное"
            breadcrumbs={breadcrumbs}
        >
            <FavoritesListing
                listing={listing}
                pagination={pagination}
            />
        </CatalogPageLayout>
    );
}

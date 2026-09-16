import type { Metadata } from 'next';

import { CatalogPageLayout } from '@/app/(shop)/(catalog)/_components/CatalogPageLayout';
import { AuthenticatedFavoritesContent } from '@/app/(shop)/(catalog)/favorites/_components/AuthenticatedFavoritesContent';
import { GuestFavoritesContent } from '@/app/(shop)/(catalog)/favorites/_components/GuestFavoritesContent';
import type { ProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { getSession } from '@/auth/session';
import type { BreadcrumbItem } from '@/components/breadcrumbs/breadcrumbs.types';
import { routes } from '@/routes';

interface FavoritesPageProps {
    searchParams: Promise<ProductListingSearchParams>;
}

export const metadata: Metadata = {
    title: 'Избранное',
};

export default async function FavoritesPage({
    searchParams,
}: FavoritesPageProps) {
    const params = await searchParams;
    const session = await getSession();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            label: 'Главная',
            href: routes.homePage(),
        },
        {
            label: 'Избранное',
        },
    ];

    return (
        <CatalogPageLayout
            title="Избранное"
            breadcrumbs={breadcrumbs}
        >
            {session ? (
                <AuthenticatedFavoritesContent
                    params={params}
                    userId={session.user.id}
                />
            ) : (
                <GuestFavoritesContent params={params} />
            )}
        </CatalogPageLayout>
    );
}

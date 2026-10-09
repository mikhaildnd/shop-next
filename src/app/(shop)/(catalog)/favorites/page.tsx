import type { Metadata } from 'next';

import { CatalogPageLayout } from '@/app/(shop)/(catalog)/_components/CatalogPageLayout';
import { FavoritesContent } from '@/app/(shop)/(catalog)/favorites/_components/FavoritesContent';
import type { ProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
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
            <FavoritesContent params={params} />
        </CatalogPageLayout>
    );
}

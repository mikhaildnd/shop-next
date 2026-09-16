import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CatalogPageLayout } from '@/app/(shop)/(catalog)/_components/CatalogPageLayout';
import { CollectionPageContent } from '@/app/(shop)/(catalog)/collection/_components/CollectionPageContent';
import type { ProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import type { BreadcrumbItem } from '@/components/breadcrumbs/breadcrumbs.types';
import { routes } from '@/routes';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import type { CollectionDto } from '@/services/collection/collection.types';

interface CollectionPageProps {
    params: Promise<{
        collectionSlug: string;
    }>;

    searchParams: Promise<ProductListingSearchParams>;
}

export async function generateMetadata({
    params,
}: CollectionPageProps): Promise<Metadata> {
    const { collectionSlug: slug } = await params;

    const collection: CollectionDto | null = await getCollectionBySlug(slug);

    if (!collection) {
        return {
            title: 'Коллекция не найдена',
        };
    }

    return {
        title: collection.title,
        description: `Коллекция | ${collection.title}`,
    };
}

export default async function CollectionPage({
    params,
    searchParams,
}: CollectionPageProps) {
    const [{ collectionSlug: slug }, query] = await Promise.all([
        params,
        searchParams,
    ]);

    const collection: CollectionDto | null = await getCollectionBySlug(slug);

    if (!collection) {
        notFound();
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            label: 'Главная',
            href: routes.homePage(),
        },
        {
            label: collection.title,
        },
    ];

    return (
        <CatalogPageLayout
            title={collection.title}
            breadcrumbs={breadcrumbs}
        >
            <CollectionPageContent
                params={query}
                collectionSlug={collection.slug}
            />
        </CatalogPageLayout>
    );
}

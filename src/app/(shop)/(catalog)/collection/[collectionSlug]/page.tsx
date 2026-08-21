import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CatalogPageLayout } from '@/app/(shop)/(catalog)/_components/CatalogPageLayout';
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
import { routes } from '@/routes';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import type { CollectionDto } from '@/services/collection/collection.types';
import { getProductsForListing } from '@/services/product/use-cases/get-products-for-listing';

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

    const listing = parseProductListing(query);

    const pagination = getPaginationParams({
        searchParams: query,
        limit: PRODUCTS_PER_PAGE,
    });

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

    const hasIssues = listing.issues.length > 0 || pagination.issues.length > 0;

    if (hasIssues) {
        return (
            <CatalogPageLayout
                title={collection.title}
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

    const { products, totalProductsCount, listingStats } =
        await getProductsForListing({
            userId: session?.user.id,
            take: pagination.take,
            skip: pagination.skip,
            collectionSlug: collection?.slug,
            filters: listing.filters,
            sort: listing.sort,
        });

    const totalPages = Math.ceil(totalProductsCount / PRODUCTS_PER_PAGE);

    if (pagination.currentPage > totalPages && totalProductsCount > 0) {
        return (
            <CatalogPageLayout
                title={collection.title}
                breadcrumbs={breadcrumbs}
            >
                <InvalidPageState />
            </CatalogPageLayout>
        );
    }

    if (totalProductsCount === 0) {
        return (
            <CatalogPageLayout
                title={collection.title}
                breadcrumbs={breadcrumbs}
            >
                <EmptyProductState description="Попробуйте открыть другую коллекцию" />
            </CatalogPageLayout>
        );
    }

    return (
        <CatalogPageLayout
            title={collection.title}
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

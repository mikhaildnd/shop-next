import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageStateLayout } from '@/app/(shop)/(catalog)/_components/layouts/PageStateLayout';
import { ProductListingLayout } from '@/app/(shop)/(catalog)/_components/layouts/ProductListingLayout';
import { PageIssues } from '@/app/(shop)/(catalog)/_components/page-issues/PageIssues';
import { EmptyProductState } from '@/app/(shop)/(catalog)/_components/page-states/EmptyProductState';
import { InvalidPageState } from '@/app/(shop)/(catalog)/_components/page-states/InvalidPageState';
import { ProductsListContent } from '@/app/(shop)/(catalog)/_components/ProductsListContent';
import { parseProductListing } from '@/app/(shop)/(catalog)/lib/product-listing/parse-product-listing';
import { PRODUCTS_PER_PAGE } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductListingSearchParams } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import type { BreadcrumbItem } from '@/components/breadcrumbs/breadcrumbs.types';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { routes } from '@/routes';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import type { CollectionDto } from '@/services/collection/collection.types';
import { getProducts } from '@/services/product/product.service';

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

    const collection = await getCollectionBySlug(slug);

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
            <PageStateLayout
                title={collection.title}
                breadcrumbs={breadcrumbs}
            >
                <PageIssues
                    listingIssues={listing.issues}
                    paginationIssues={pagination.issues}
                />
            </PageStateLayout>
        );
    }

    const { products, totalProductsCount, listingStats } = await getProducts({
        take: pagination.take,
        skip: pagination.skip,
        collectionSlug: collection?.slug,
        filters: listing.filters,
        sort: listing.sort,
    });

    const totalPages = Math.ceil(totalProductsCount / PRODUCTS_PER_PAGE);

    if (pagination.currentPage > totalPages && totalProductsCount > 0) {
        return (
            <PageStateLayout
                title={collection.title}
                breadcrumbs={breadcrumbs}
            >
                <InvalidPageState />
            </PageStateLayout>
        );
    }

    if (totalProductsCount === 0) {
        return (
            <PageStateLayout
                title={collection.title}
                breadcrumbs={breadcrumbs}
            >
                <EmptyProductState description="Попробуйте открыть другую коллекцию" />
            </PageStateLayout>
        );
    }

    return (
        <ProductListingLayout
            sort={listing.sort}
            listingStats={listingStats}
            title={collection.title}
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

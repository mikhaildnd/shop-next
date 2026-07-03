import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts } from '@/services/product/product.service';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import ProductsListContent from '@/app/(shop)/(catalog)/_components/ProductsListContent';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import type { CollectionDto } from '@/services/collection/collection.types';
import ProductListingLayout from '@/app/(shop)/(catalog)/_components/layouts/ProductListingLayout';
import { buildCollectionBreadcrumbs } from '@/lib/breadcrumbs/buildCollectionBreadcrumbs';
import { PRODUCTS_PER_PAGE } from '@/lib/product-listing/consts';
import type { ProductListingSearchParams } from '@/lib/product-listing/types';
import { parseProductListing } from '@/lib/product-listing/parse-product-listing';
import { PageStateLayout } from '@/app/(shop)/(catalog)/_components/layouts/PageStateLayout';
import { PageIssues } from '@/components/page-issues/ui/PageIssues';
import { CollectionProductsSection } from '@/app/(shop)/(catalog)/_components/CollectionProductsSection';
import { InvalidPageState } from '@/app/(shop)/(catalog)/_components/page-states/InvalidPageState';
import { EmptyProductState } from '@/app/(shop)/(catalog)/_components/page-states/EmptyProductState';

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

    const breadcrumbs = buildCollectionBreadcrumbs({
        collection,
    });

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

    const { products, filteredProductsCount, listingStats } = await getProducts(
        {
            take: pagination.take,
            skip: pagination.skip,
            collectionSlug: collection?.slug,
            filters: listing.filters,
            sort: listing.sort,
        },
    );

    const totalPages = Math.ceil(filteredProductsCount / PRODUCTS_PER_PAGE);

    if (pagination.currentPage > totalPages && filteredProductsCount > 0) {
        return (
            <PageStateLayout
                title={collection.title}
                breadcrumbs={breadcrumbs}
            >
                <InvalidPageState />
            </PageStateLayout>
        );
    }

    if (filteredProductsCount === 0) {
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
            filteredProductsCount={filteredProductsCount}
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

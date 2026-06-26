import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getProducts } from '@/services/product/product.service';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import ProductsListEmpty from '@/app/(shop)/(catalog)/_components/ProductsListEmpty';
import ProductsListContent from '@/app/(shop)/(catalog)/_components/ProductsListContent';
import { routes } from '@/lib/routes';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import type { CollectionDto } from '@/services/collection/collection.types';
import { buildSearchParams } from '@/lib/url/build-search-params';
import ProductListingLayout from '@/app/(shop)/(catalog)/_components/ProductListingLayout';
import { buildCollectionBreadcrumbs } from '@/lib/breadcrumbs/buildCollectionBreadcrumbs';
import { PRODUCTS_PER_PAGE } from '@/lib/product-listing/consts';
import type { ProductListingSearchParams } from '@/lib/product-listing/types';
import { getCanonicalPaginationSearchParams } from '@/lib/pagination/get-canonical-pagination-search-params';
import { getCanonicalProductSearchParams } from '@/lib/product-listing/canonical/get-canonical-product-search-params';
import { parseProductListing } from '@/lib/product-listing/parse-product-listing';

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

    const { filters, sort } = parseProductListing(query);

    const canonicalSearch = buildSearchParams({
        params: {
            ...getCanonicalPaginationSearchParams(query),
            ...getCanonicalProductSearchParams(query),
        },
    });

    const currentSearch = buildSearchParams({
        params: query,
    });

    if (canonicalSearch !== currentSearch) {
        redirect(`${routes.collectionPage(slug)}${canonicalSearch}`);
    }

    const collection: CollectionDto | null = await getCollectionBySlug(slug);

    if (!collection) {
        notFound();
    }

    const { currentPage, startPage, take, skip } = getPaginationParams({
        searchParams: query,
        limit: PRODUCTS_PER_PAGE,
    });

    const { products, filteredProductsCount, filtersMeta } = await getProducts({
        take,
        skip,
        collectionSlug: collection?.slug,
        filters,
        sort,
    });

    const totalPages = Math.ceil(filteredProductsCount / PRODUCTS_PER_PAGE);

    if (currentPage > totalPages) {
        notFound();
    }

    const breadcrumbs = buildCollectionBreadcrumbs({
        collection,
    });

    return (
        <ProductListingLayout
            filtersMeta={filtersMeta}
            filteredProductsCount={filteredProductsCount}
            title={collection.title}
            breadcrumbs={breadcrumbs}
        >
            {filteredProductsCount === 0 ? (
                <ProductsListEmpty
                    title="Товары не найдены"
                    description="Попробуйте открыть другую категорию"
                />
            ) : (
                <ProductsListContent
                    products={products}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    startPage={startPage}
                    getProductHref={(product) =>
                        routes.productInCategory(product.slug, slug)
                    }
                />
            )}
        </ProductListingLayout>
    );
}

import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getProducts } from '@/services/product/product.service';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { PRODUCTS_PER_PAGE } from '@/consts/pagination';
import ProductsListEmpty from '@/app/(shop)/(catalog)/_components/ProductsListEmpty';
import ProductsListContent from '@/app/(shop)/(catalog)/_components/ProductsListContent';
import { routes } from '@/lib/routes';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import type { CollectionDto } from '@/services/collection/collection.types';
import type { ProductSearchParams } from '@/lib/product/types';
import { getCanonicalProductListingUrl } from '@/lib/product/canonical/get-canonical-product-listing-url';
import { createUrl } from '@/lib/url/create-url';

const LIMIT = PRODUCTS_PER_PAGE;

type PageProps = {
    params: Promise<{
        collectionSlug: string;
    }>;

    searchParams: Promise<ProductSearchParams>;
};

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { collectionSlug: slug } = await params;

    const collection = await getCollectionBySlug(slug);

    if (!collection) {
        return {
            title: 'Коллекция не найдена',
        };
    }

    return {
        title: collection.title,
        description: `Каталог | ${collection.title}`,
    };
}

export default async function Page({ params, searchParams }: PageProps) {
    const [{ collectionSlug: slug }, query] = await Promise.all([
        params,
        searchParams,
    ]);

    const canonicalSearch = getCanonicalProductListingUrl(query);
    const currentSearch = createUrl({
        searchParams: new URLSearchParams(),
        params: query,
    });

    if (canonicalSearch !== currentSearch) {
        redirect(`${routes.collection(slug)}${canonicalSearch}`);
    }

    const collection: CollectionDto | null = await getCollectionBySlug(slug);

    if (!collection) {
        notFound();
    }

    const { currentPage, startPage, take, skip } = getPaginationParams({
        searchParams: query,
        limit: LIMIT,
    });

    const { products, filteredProductsCount } = await getProducts({
        take,
        skip,
        collectionSlug: collection?.slug,
        searchParams: query,
    });

    const totalPages = Math.ceil(filteredProductsCount / LIMIT);

    if (currentPage > totalPages) {
        notFound();
    }

    return (
        <div className="page-spacing">
            <h1 className="mb-2 catalog-heading xl:mb-3">{collection.title}</h1>
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
        </div>
    );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts } from '@/services/product/product.service';
import { getPaginationParams } from '@/lib/pagination/get-pagination-params';
import { PRODUCTS_PER_PAGE } from '@/consts/pagination';
import type { PaginationSearchParams } from '@/lib/pagination/types';
import ProductsListEmpty from '@/app/(shop)/(catalog)/_components/ProductsListEmpty';
import ProductsListContent from '@/app/(shop)/(catalog)/_components/ProductsListContent';
import { routes } from '@/lib/routes';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import type { CollectionDto } from '@/services/collection/collection.types';

const LIMIT = PRODUCTS_PER_PAGE;

type PageProps = {
    params: Promise<{
        collectionSlug: string;
    }>;

    searchParams: Promise<PaginationSearchParams>;
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

    const collection: CollectionDto | null = await getCollectionBySlug(slug);

    if (!collection) {
        notFound();
    }

    const { currentPage, startPage, take, skip } = getPaginationParams({
        searchParams: query,
        limit: LIMIT,
    });

    const { products, totalCount } = await getProducts({
        take,
        skip,
        collectionSlug: collection?.slug,
    });

    const totalPages = Math.ceil(totalCount / LIMIT);

    if (currentPage > totalPages) {
        notFound();
    }

    return (
        <div className="page-spacing">
            <h1 className="mb-2 catalog-heading xl:mb-3">{collection.title}</h1>
            {totalCount === 0 ? (
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

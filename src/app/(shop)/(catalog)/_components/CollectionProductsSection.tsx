import { ProductGrid } from '@/app/(shop)/(catalog)/_components/ProductGrid';
import { getSession } from '@/auth/session';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import { DEFAULT_PRODUCT_FILTERS } from '@/services/product/filters/filter.constants';
import { DEFAULT_PRODUCT_SORT } from '@/services/product/sort/sort.constants';
import { getProductsForListing } from '@/services/product/use-cases/get-products-for-listing';

interface CollectionProductsSectionProps {
    collectionSlug: string;
    take?: number;
}

export async function CollectionProductsSection({
    collectionSlug,
    take = 12,
}: CollectionProductsSectionProps) {
    const session = await getSession();

    const [collection, { products }] = await Promise.all([
        getCollectionBySlug(collectionSlug),

        getProductsForListing({
            userId: session?.user.id,
            collectionSlug,
            take,
            filters: DEFAULT_PRODUCT_FILTERS,
            sort: DEFAULT_PRODUCT_SORT,
        }),
    ]);

    if (!collection || products.length === 0) {
        return null;
    }

    return (
        <section className="mt-10 flex flex-col gap-6">
            <h2 className="catalog-heading">Рекомендуем также</h2>

            <ProductGrid products={products} />
        </section>
    );
}

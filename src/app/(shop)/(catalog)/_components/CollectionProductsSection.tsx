import { ProductGrid } from '@/app/(shop)/(catalog)/_components/ProductGrid';
import { DEFAULT_PRODUCT_FILTERS } from '@/lib/product-listing/filters/consts';
import { DEFAULT_PRODUCT_SORT } from '@/lib/product-listing/sort/consts';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import { getProducts } from '@/services/product/product.service';

interface CollectionProductsSectionProps {
    collectionSlug: string;
    take?: number;
}

export async function CollectionProductsSection({
    collectionSlug,
    take = 12,
}: CollectionProductsSectionProps) {
    const [collection, { products }] = await Promise.all([
        getCollectionBySlug(collectionSlug),
        getProducts({
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

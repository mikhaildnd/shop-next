import { ProductGrid } from '@/app/(shop)/(catalog)/_components/ProductGrid';
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
            take,
            selectionScope: {
                collections: {
                    some: {
                        collection: {
                            slug: collectionSlug,
                        },
                    },
                },
            },
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

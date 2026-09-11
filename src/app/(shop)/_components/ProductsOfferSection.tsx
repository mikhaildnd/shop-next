import { ProductsSection } from '@/app/(shop)/_components/products-section/ProductsSection';
import { routes } from '@/routes';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import { getProducts } from '@/services/product/product.service';

export async function ProductsOfferSection() {
    const [collection, productsData] = await Promise.all([
        getCollectionBySlug('promotion'),

        getProducts({
            take: 8,
            selectionScope: {
                collections: {
                    some: {
                        collection: {
                            slug: 'promotion',
                        },
                    },
                },
            },
        }),
    ]);

    if (!collection) {
        return null;
    }

    return (
        <ProductsSection
            title={collection.title}
            link={routes.collectionPage(collection.slug)}
            products={productsData.products}
        />
    );
}

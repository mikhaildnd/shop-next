import { ProductsSection } from '@/app/(shop)/_components/products-section/ProductsSection';
import { routes } from '@/routes';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import { getProductsByCollection } from '@/services/product/product.service';

interface ProductsSliderSectionProps {
    collectionSlug: string;
    productsCount: number;
}

export async function ProductsSliderSection({
    collectionSlug,
    productsCount,
}: ProductsSliderSectionProps) {
    const [collection, products] = await Promise.all([
        getCollectionBySlug(collectionSlug),

        getProductsByCollection(collectionSlug, productsCount),
    ]);

    if (!collection) {
        return null;
    }

    return (
        <ProductsSection
            title={collection.title}
            link={routes.collectionPage(collection.slug)}
            products={products}
        />
    );
}

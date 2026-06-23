import ProductsSection from '@/components/product/productsSection/ProductsSection';
import { routes } from '@/lib/routes';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import { getProducts } from '@/services/product/product.service';

const ProductsNewSection = async () => {
    const [collection, productsData] = await Promise.all([
        getCollectionBySlug('new'),
        getProducts({
            collectionSlug: 'new',
            take: 8,
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
};

export default ProductsNewSection;

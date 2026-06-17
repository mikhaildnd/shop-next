import ProductsSection from '@/components/product/productsSection/ProductsSection';
import { routes } from '@/lib/routes';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import { getProducts } from '@/services/product/product.service';

const ProductsOfferSection = async () => {
    const [collection, productsData] = await Promise.all([
        getCollectionBySlug('promotion'),
        getProducts({
            collectionSlug: 'promotion',
            take: 8,
        }),
    ]);

    if (!collection) {
        return null;
    }

    return (
        <ProductsSection
            title={collection.title}
            link={routes.collection(collection.slug)}
            products={productsData.products}
        />
    );
};

export default ProductsOfferSection;

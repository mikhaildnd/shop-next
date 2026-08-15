import { ProductsSection } from '@/app/(shop)/_components/products-section/ProductsSection';
import { routes } from '@/routes';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import { getProducts } from '@/services/product/product.service';
import { DEFAULT_PRODUCT_SORT } from '@/services/product/sort/sort.constants';

export async function ProductsOfferSection() {
    const [collection, productsData] = await Promise.all([
        getCollectionBySlug('promotion'),
        getProducts({
            collectionSlug: 'promotion',
            take: 8,
            sort: DEFAULT_PRODUCT_SORT,
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

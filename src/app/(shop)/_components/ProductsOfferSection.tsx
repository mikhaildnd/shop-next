import { ProductsSection } from '@/app/(shop)/_components/products-section/ProductsSection';
import { getSession } from '@/auth/session';
import { routes } from '@/routes';
import { getCollectionBySlug } from '@/services/collection/collection.service';
import { DEFAULT_PRODUCT_SORT } from '@/services/product/sort/sort.constants';
import { getProductsForListing } from '@/services/product/use-cases/get-products-for-listing';

export async function ProductsOfferSection() {
    const session = await getSession();

    const [collection, productsData] = await Promise.all([
        getCollectionBySlug('promotion'),

        getProductsForListing({
            userId: session?.user.id,
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

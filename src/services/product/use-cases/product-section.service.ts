import { getProducts } from '@/services/product/product.service';
import type { ProductsResponse } from '@/services/product/product.types';
import { getCollectionBySlug } from '@/services/collection/collection.service';

type ProductsSectionData = {
    title: string;
    slug: string;
} & ProductsResponse;

type GetProductsSectionParams = {
    collection: string;
    take?: number;
};

export async function getProductsSection({
    collection,
    take,
}: GetProductsSectionParams): Promise<ProductsSectionData | null> {
    const [fetchedCollection, productsData] = await Promise.all([
        getCollectionBySlug(collection),
        getProducts({
            collectionSlug: collection,
            take,
        }),
    ]);

    if (!fetchedCollection) {
        return null;
    }

    return {
        title: fetchedCollection.title,
        slug: fetchedCollection.slug,
        products: productsData.products,
        totalCount: productsData.totalCount,
    };
}

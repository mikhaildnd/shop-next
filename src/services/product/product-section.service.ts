import { getProducts } from '@/services/product/product.service';
import { getCategoryBySlug } from '@/services/category.service';
import type { ProductsResponse } from '@/services/product/types';

type ProductsSectionData = {
    title: string;
    slug: string;
} & ProductsResponse;

type GetProductsSectionParams = {
    category: string;
    take?: number;
};

export async function getProductsSection({
    category,
    take,
}: GetProductsSectionParams): Promise<ProductsSectionData | null> {
    const [fetchedCategory, productsData] = await Promise.all([
        getCategoryBySlug(category),
        getProducts({
            category,
            take,
        }),
    ]);

    if (!fetchedCategory) {
        return null;
    }

    return {
        title: fetchedCategory.title,
        slug: fetchedCategory.slug,
        products: productsData.products,
        totalCount: productsData.totalCount,
    };
}

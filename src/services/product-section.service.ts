import { getProducts } from '@/services/product.service';
import { getCategoryBySlug } from '@/services/category.service';

import type { ProductDto } from '@/types/product';

type ProductsSectionData = {
    title: string;
    slug: string;
    products: ProductDto[];
    totalCount: number;
};

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

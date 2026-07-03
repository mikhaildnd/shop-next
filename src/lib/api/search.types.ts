import type { CategoryDto } from '@/services/category/category.types';
import type { ProductDto } from '@/services/product/product.types';

export type SearchResponse = {
    products: ProductDto[];
    productsCount: number;
    categories: CategoryDto[];
};

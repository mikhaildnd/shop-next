import type { ProductDto } from '@/services/product/product.types';
import type { CategoryDto } from '@/services/category/category.types';

export type SearchResponse = {
    products: ProductDto[];
    productsCount: number;
    categories: CategoryDto[];
};

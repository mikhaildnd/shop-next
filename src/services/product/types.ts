import type { ProductDto } from '@/types/product';

export type ProductsResponse = {
    products: ProductDto[];
    totalCount: number;
};

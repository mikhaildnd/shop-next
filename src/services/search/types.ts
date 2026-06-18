import type { Category } from '@/generated/prisma/client';

import type { ProductDto } from '@/services/product/product.types';

export type SearchResponse = {
    products: ProductDto[];
    productsCount: number;
    categories: Category[];
};

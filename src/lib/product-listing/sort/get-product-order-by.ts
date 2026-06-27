import type { Prisma } from '@/generated/prisma/client';
import type { ProductSort } from '@/lib/product-listing/sort/types';

type ProductsOrderByResult =
    | Prisma.ProductOrderByWithRelationInput
    | Prisma.ProductOrderByWithRelationInput[];

export const getProductOrderBy = (sort: ProductSort): ProductsOrderByResult => {
    switch (sort) {
        case 'price-asc':
            return { effectivePrice: 'asc' };

        case 'price-desc':
            return { effectivePrice: 'desc' };

        case 'popular':
            return [
                {
                    ratingCount: 'desc',
                },
                {
                    ratingRate: 'desc',
                },
                {
                    createdAt: 'desc',
                },
            ];

        case 'newest':
        default:
            return { createdAt: 'desc' };
    }
};

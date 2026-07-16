import type { Prisma } from '@/generated/prisma/client';
import { getProductWhere } from '@/lib/product-listing/filters/get-product-where';
import type { ProductFilters } from '@/lib/product-listing/filters/types';

type BuildProductQueryOptions = {
    filters?: ProductFilters;
    categorySlugs?: string[];
    collectionSlug?: string;
};

export function buildProductWhere({
    filters,
    categorySlugs,
    collectionSlug,
}: BuildProductQueryOptions) {
    const where: Prisma.ProductWhereInput = filters
        ? getProductWhere(filters)
        : {};

    if (categorySlugs?.length) {
        where.category = {
            slug: {
                in: categorySlugs,
            },
        };
    }

    if (collectionSlug) {
        where.collections = {
            some: {
                collection: {
                    slug: collectionSlug,
                },
            },
        };
    }

    return where;
}

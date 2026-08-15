import type { Prisma } from '@/generated/prisma/client';
import type { ProductFilters } from '@/services/product/filters/filter.types';
import { getProductWhere } from '@/services/product/filters/get-product-where';

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

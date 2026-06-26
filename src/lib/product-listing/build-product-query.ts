import { getProductWhere } from '@/lib/product-listing/filters/get-product-where';
import type { ProductFilters } from '@/lib/product-listing/filters/types';
import type { Prisma } from '@/generated/prisma/client';

interface BuildProductQueryOptions {
    filters?: ProductFilters;
    categorySlugs?: string[];
    collectionSlug?: string;
}

export function buildProductQuery({
    filters,
    categorySlugs,
    collectionSlug,
}: BuildProductQueryOptions) {
    const filtersWhere: Prisma.ProductWhereInput = filters
        ? getProductWhere(filters)
        : {};
    const listingWhere: Prisma.ProductWhereInput = {};

    if (categorySlugs?.length) {
        const categoryWhere = {
            slug: {
                in: categorySlugs,
            },
        };

        filtersWhere.category = categoryWhere;
        listingWhere.category = categoryWhere;
    }

    if (collectionSlug) {
        const collectionsWhere = {
            some: {
                collection: {
                    slug: collectionSlug,
                },
            },
        };

        filtersWhere.collections = collectionsWhere;
        listingWhere.collections = collectionsWhere;
    }

    return {
        filtersWhere,
        listingWhere,
    };
}

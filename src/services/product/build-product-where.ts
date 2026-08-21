import type { Prisma } from '@/generated/prisma/client';
import type { ProductFilters } from '@/services/product/filters/filter.types';
import { getProductWhere } from '@/services/product/filters/get-product-where';

type BuildProductQueryOptions = {
    filters?: ProductFilters;
    categorySlugs?: string[];
    collectionSlug?: string;
    favoriteIds?: string[];
    favoritesForUserId?: string;
};

export function buildProductWhere({
    filters,
    categorySlugs,
    collectionSlug,
    favoriteIds,
    favoritesForUserId,
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

    if (favoriteIds !== undefined) {
        where.id = {
            in: favoriteIds,
        };
    }

    if (favoritesForUserId) {
        where.favorites = {
            some: {
                userId: favoritesForUserId,
            },
        };
    }

    return where;
}

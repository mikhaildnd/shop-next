import { cache } from 'react';

import { prisma } from '@/db';
import { buildProductWhere } from '@/services/product/build-product-where';
import type { ProductFilters } from '@/services/product/filters/filter.types';
import { productInclude } from '@/services/product/product.constants';
import { mapProductToDto } from '@/services/product/product.mapper';
import type {
    ProductDto,
    ProductListingStats,
    ProductsResponse,
} from '@/services/product/product.types';
import { getProductOrderBy } from '@/services/product/sort/get-product-order-by';
import type { ProductSort } from '@/services/product/sort/sort.types';

type GetProductsParams = {
    take?: number;
    skip?: number;
    filters?: ProductFilters;
    sort: ProductSort;
    categorySlugs?: string[];
    collectionSlug?: string;
    favoriteIds?: string[];
};

export async function getProducts({
    take,
    skip = 0,
    sort,
    filters,
    categorySlugs,
    collectionSlug,
    favoriteIds,
}: GetProductsParams): Promise<ProductsResponse> {
    const listingWhere = buildProductWhere({
        filters,
        categorySlugs,
        collectionSlug,
        favoriteIds,
    });

    const priceStatsWhere = buildProductWhere({
        filters: filters
            ? {
                  // Price aggregates should ignore the current price filter.
                  ...filters,
                  priceFrom: null,
                  priceTo: null,
              }
            : undefined,
        categorySlugs,
        collectionSlug,
        favoriteIds,
    });

    const [products, totalProductsCount, priceAggregates, saleProduct] =
        await Promise.all([
            prisma.product.findMany({
                where: listingWhere,
                include: productInclude,
                skip,
                take,

                orderBy: getProductOrderBy(sort),
            }),

            prisma.product.count({
                where: listingWhere,
            }),

            prisma.product.aggregate({
                where: priceStatsWhere,
                _min: {
                    effectivePrice: true,
                },
                _max: {
                    effectivePrice: true,
                    discountPercent: true,
                },
            }),

            prisma.product.findFirst({
                where: {
                    ...listingWhere,
                    salePrice: {
                        not: null,
                    },
                },
                select: {
                    id: true,
                },
            }),
        ]);

    const listingStats: ProductListingStats = {
        minPrice: Number(priceAggregates._min.effectivePrice ?? 0),
        maxPrice: Number(priceAggregates._max.effectivePrice ?? 0),
        maxDiscount: Number(priceAggregates._max.discountPercent ?? 0),
        hasSaleProducts: saleProduct !== null,
    };

    return {
        products: products.map(mapProductToDto),
        totalProductsCount,
        listingStats,
    };
}

export const getProductBySlug = cache(
    async (slug: string): Promise<ProductDto | null> => {
        const product = await prisma.product.findUnique({
            where: {
                slug,
            },
            include: productInclude,
        });

        if (!product) {
            return null;
        }

        return mapProductToDto(product);
    },
);

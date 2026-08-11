import { cache } from 'react';

import { prisma } from '@/lib/db';
import { mapProductToDto } from '@/lib/mappers/product.mapper';
import { productInclude } from '@/lib/prisma/product';
import { buildProductWhere } from '@/lib/product-listing/build-product-where';
import type { ProductFilters } from '@/lib/product-listing/filters/types';
import { getProductOrderBy } from '@/lib/product-listing/sort/get-product-order-by';
import type { ProductSort } from '@/lib/product-listing/sort/types';
import type {
    ProductDto,
    ProductListingStats,
    ProductsResponse,
} from '@/services/product/product.types';

type GetProductsParams = {
    filters?: ProductFilters;
    sort: ProductSort;
    take?: number;
    skip?: number;
    categorySlugs?: string[];
    collectionSlug?: string;
};

export async function getProducts({
    take,
    skip = 0,
    categorySlugs,
    collectionSlug,
    sort,
    filters,
}: GetProductsParams): Promise<ProductsResponse> {
    const listingWhere = buildProductWhere({
        filters,
        categorySlugs,
        collectionSlug,
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

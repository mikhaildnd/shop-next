import { cache } from 'react';

import { prisma } from '@/lib/db';
import { mapProductToDto } from '@/lib/mappers/product.mapper';
import { productInclude } from '@/lib/prisma/product';
import { buildProductQuery } from '@/lib/product-listing/build-product-query';
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
    const { listingWhere, filtersWhere } = buildProductQuery({
        filters,
        categorySlugs,
        collectionSlug,
    });

    const [
        products,
        filteredProductsCount,
        totalProductsCount,
        listingAggregates,
    ] = await Promise.all([
        prisma.product.findMany({
            where: filtersWhere,
            include: productInclude,
            skip,
            take,

            orderBy: getProductOrderBy(sort),
        }),

        prisma.product.count({
            where: filtersWhere,
        }),

        prisma.product.count({
            where: listingWhere,
        }),

        prisma.product.aggregate({
            where: listingWhere,
            _min: {
                effectivePrice: true,
            },
            _max: {
                effectivePrice: true,
                discountPercent: true,
            },
        }),
    ]);

    const listingStats: ProductListingStats = {
        minPrice: Number(listingAggregates._min.effectivePrice ?? 0),
        maxPrice: Number(listingAggregates._max.effectivePrice ?? 0),
        maxDiscount: Number(listingAggregates._max.discountPercent ?? 0),
        totalProductsCount,
    };

    return {
        products: products.map(mapProductToDto),
        filteredProductsCount,
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

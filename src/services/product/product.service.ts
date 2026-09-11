import { cache } from 'react';

import { prisma } from '@/db';
import type { Prisma } from '@/generated/prisma/client';
import { DEFAULT_PRODUCT_FILTERS } from '@/services/product/filters/filter.constants';
import type { ProductFilters } from '@/services/product/filters/filter.types';
import { getProductWhere } from '@/services/product/filters/get-product-where';
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
    query?: string | null;
    filters?: ProductFilters;
    sort?: ProductSort;
    selectionScope?: Prisma.ProductWhereInput;
};

export async function getProducts({
    take,
    skip = 0,
    query,
    sort,
    filters,
    selectionScope,
}: GetProductsParams): Promise<ProductsResponse> {
    const listingFilters = {
        ...DEFAULT_PRODUCT_FILTERS,
        ...filters,
    };

    const listingWhere = getProductWhere({
        query,
        filters: listingFilters,
    });

    const where = selectionScope
        ? {
              AND: [listingWhere, selectionScope],
          }
        : listingWhere;

    const [products, totalProductsCount] = await Promise.all([
        prisma.product.findMany({
            where,
            include: productInclude,
            skip,
            take,

            orderBy: getProductOrderBy(sort),
        }),

        prisma.product.count({
            where,
        }),
    ]);

    return {
        products: products.map(mapProductToDto),
        totalProductsCount,
    };
}

type GetProductListingStatsParams = {
    query?: string | null;
    filters?: ProductFilters;
    selectionScope?: Prisma.ProductWhereInput;
};

export async function getProductListingStats({
    query,
    filters,
    selectionScope,
}: GetProductListingStatsParams): Promise<ProductListingStats> {
    const listingFilters = {
        ...DEFAULT_PRODUCT_FILTERS,
        ...filters,
    };

    const statsFilters: ProductFilters = {
        ...listingFilters,
        priceFrom: null,
        priceTo: null,
    };

    const statsListingWhere = getProductWhere({
        query,
        filters: statsFilters,
    });

    const where = selectionScope
        ? {
              AND: [statsListingWhere, selectionScope],
          }
        : statsListingWhere;

    const [priceAggregates, saleProduct] = await Promise.all([
        prisma.product.aggregate({
            where,
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
                ...where,
                salePrice: {
                    not: null,
                },
            },
            select: {
                id: true,
            },
        }),
    ]);

    return {
        minPrice: Number(priceAggregates._min.effectivePrice ?? 0),
        maxPrice: Number(priceAggregates._max.effectivePrice ?? 0),
        maxDiscount: Number(priceAggregates._max.discountPercent ?? 0),
        hasSaleProducts: saleProduct !== null,
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

export const getProductsByIds = cache(
    async (ids: string[]): Promise<ProductDto[]> => {
        if (ids.length === 0) {
            return [];
        }

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            include: productInclude,
        });

        return products.map(mapProductToDto);
    },
);

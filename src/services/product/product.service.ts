import { prisma } from '@/lib/db';
import { mapProductToDto } from '@/lib/mappers/product.mapper';
import { cache } from 'react';
import type {
    ProductDto,
    ProductFiltersMeta,
    ProductsResponse,
} from '@/services/product/product.types';
import { productInclude } from '@/lib/prisma/product';
import { getProductOrderBy } from '@/lib/product-listing/sort/get-product-order-by';
import { DISCOUNT_FILTER_VALUES } from '@/lib/product-listing/filters/consts';
import type { ProductFilters } from '@/lib/product-listing/filters/types';
import type { ProductSort } from '@/lib/product-listing/sort/types';
import { buildProductQuery } from '@/lib/product-listing/build-product-query';
import { DEFAULT_PRODUCT_SORT } from '@/lib/product-listing/sort/consts';

type GetProductsParams = {
    filters?: ProductFilters;
    sort?: ProductSort;
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
    sort = DEFAULT_PRODUCT_SORT,
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
        priceRange,
        discountRange,
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
            },
        }),

        prisma.product.aggregate({
            where: listingWhere,
            _max: {
                discountPercent: true,
            },
        }),
    ]);

    const maxDiscount = discountRange._max.discountPercent ?? 0;

    const availableDiscounts = DISCOUNT_FILTER_VALUES.filter(
        (discount) => discount <= maxDiscount,
    );

    const filtersMeta: ProductFiltersMeta = {
        minPrice: Number(priceRange._min.effectivePrice ?? 0),
        maxPrice: Number(priceRange._max.effectivePrice ?? 0),
        totalProductsCount,
        availableDiscounts,
    };

    return {
        products: products.map(mapProductToDto),
        filteredProductsCount,
        filtersMeta,
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

import { prisma } from '@/lib/db';
import { mapProductToDto } from '@/lib/mappers/product.mapper';
import { cache } from 'react';
import type {
    ProductDto,
    ProductFiltersMeta,
    ProductsResponse,
} from '@/services/product/product.types';
import { productInclude } from '@/lib/prisma/product';
import { getProductOrderBy } from '@/lib/product/sort/get-product-order-by';
import { getProductWhere } from '@/lib/product/filters/get-product-where';
import { getProductFilters } from '@/lib/product/filters/get-product-filters';
import type { ProductSearchParams } from '@/lib/product/types';
import { normalizeSortParam } from '@/lib/product/sort/normalize/normalize-sort-param';
import type { Prisma } from '@/generated/prisma/client';
import { DISCOUNT_FILTER_VALUES } from '@/lib/product/filters/consts';

type GetProductsParams = {
    take?: number;
    skip?: number;
    categorySlugs?: string[];
    collectionSlug?: string;
    searchParams?: ProductSearchParams;
};

export async function getProducts({
    take,
    skip,
    categorySlugs,
    collectionSlug,
    searchParams,
}: GetProductsParams): Promise<ProductsResponse> {
    const filters = getProductFilters(searchParams ?? {});
    const sort = normalizeSortParam(searchParams?.sort);

    const filtersWhere = getProductWhere(filters);
    const metaWhere: Prisma.ProductWhereInput = {};

    if (categorySlugs?.length) {
        const categoryWhere = {
            slug: {
                in: categorySlugs,
            },
        };

        filtersWhere.category = categoryWhere;
        metaWhere.category = categoryWhere;
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
        metaWhere.collections = collectionsWhere;
    }

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
            where: metaWhere,
        }),

        prisma.product.aggregate({
            where: metaWhere,
            _min: {
                effectivePrice: true,
            },
            _max: {
                effectivePrice: true,
            },
        }),

        prisma.product.aggregate({
            where: metaWhere,
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

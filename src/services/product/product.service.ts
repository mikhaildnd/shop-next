import { prisma } from '@/lib/db';
import { mapProductToDto } from '@/lib/mappers/product.mapper';
import { cache } from 'react';
import type {
    ProductDto,
    ProductsResponse,
} from '@/services/product/product.types';
import { productInclude } from '@/lib/prisma/product';
import { getProductOrderBy } from '@/lib/product/sort/get-product-order-by';
import { getProductWhere } from '@/lib/product/filters/get-product-where';
import { getProductFilters } from '@/lib/product/filters/get-product-filters';
import type { ProductSearchParams } from '@/lib/product/types';
import { normalizeSortParam } from '@/lib/product/sort/normalize/normalize-sort-param';

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

    const where = getProductWhere(filters);

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

    const [products, totalCount] = await Promise.all([
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

    return { products: products.map(mapProductToDto), totalCount };
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

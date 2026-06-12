import { prisma } from '@/lib/db';
import { mapProductToDto } from '@/lib/mappers/product.mapper';
import type { Prisma } from '@/generated/prisma/client';
import { cache } from 'react';
import type {
    ProductDto,
    ProductsResponse,
} from '@/services/product/product.types';
import { productInclude } from '@/lib/prisma/product';

type GetProductsParams = {
    take?: number;
    skip?: number;

    categorySlugs?: string[];
    collectionSlug?: string;
};

export async function getProducts({
    take,
    skip,
    categorySlugs,
    collectionSlug,
}: GetProductsParams = {}): Promise<ProductsResponse> {
    const where: Prisma.ProductWhereInput = {};

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

            orderBy: {
                createdAt: 'desc',
            },
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

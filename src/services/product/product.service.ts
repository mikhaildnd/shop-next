import { prisma } from '@/lib/db';
import { mapProductToDto } from '@/lib/mappers/product.mapper';
import type { ProductDto } from '@/types/product';
import type { Prisma } from '@/generated/prisma/client';
import { cache } from 'react';
import type { ProductsResponse } from '@/services/product/types';
import { productInclude } from '@/lib/prisma/product';

type GetProductsParams = {
    take?: number;
    skip?: number;
    category?: string;
};

export async function getProducts({
    take,
    skip,
    category,
}: GetProductsParams = {}): Promise<ProductsResponse> {
    const where: Prisma.ProductWhereInput = {};

    if (category) {
        where.categories = {
            some: {
                category: {
                    slug: category,
                },
            },
        };
    }

    const [products, totalCount] = await prisma.$transaction([
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

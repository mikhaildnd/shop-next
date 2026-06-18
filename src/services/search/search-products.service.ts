import { prisma } from '@/lib/db';
import { mapProductToDto } from '@/lib/mappers/product.mapper';
import { productInclude } from '@/lib/prisma/product';
import { Prisma } from '@/generated/prisma/client';

type SearchProductsParams = {
    query: string;
    take: number;
    skip: number;
};

export async function searchProducts({
    query,
    take,
    skip,
}: SearchProductsParams) {
    const normalizedQuery = query.trim();

    const where: Prisma.ProductWhereInput = {
        title: {
            contains: normalizedQuery,
            mode: 'insensitive',
        },
    };

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            where,
            include: productInclude,
            take,
            skip,
        }),

        prisma.product.count({
            where,
        }),
    ]);

    return {
        products: products.map(mapProductToDto),
        totalCount,
    };
}

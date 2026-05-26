import { prisma } from '@/lib/db';
import { mapProductToDto } from '@/lib/mappers/product.mapper';
import type { ProductDto } from '@/types/product';
import type { Prisma } from '@/generated/prisma/client';

type GetProductsParams = {
    take?: number;
    skip?: number;
    category?: string;
};

//TODO мб вынести, т.к. повтояется в product-section.service.ts
type GetProductsResult = {
    products: ProductDto[];
    totalCount: number;
};

export async function getProducts({
    take,
    skip,
    category,
}: GetProductsParams = {}): Promise<GetProductsResult> {
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
            include: {
                images: true,
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
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

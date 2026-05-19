import { prisma } from '@/lib/db';
import { mapProductToDto } from '@/lib/mappers/product.mapper';
import type { ProductDto } from '@/types/product';
import type { Prisma } from '@/generated/prisma/client';

type GetProductsParams = {
    limit?: number;
    promotion?: boolean;
    category?: string;
};

export async function getProducts({
    limit,
    promotion,
    category,
}: GetProductsParams = {}): Promise<ProductDto[]> {
    const where: Prisma.ProductWhereInput = {};

    if (promotion) {
        where.discountPercent = {
            gt: 0,
        };
    }

    if (category) {
        where.categories = {
            some: {
                category: {
                    slug: category,
                },
            },
        };
    }

    const products = await prisma.product.findMany({
        // where: {
        //     ...(promotion && {
        //         discountPercent: {
        //             gt: 0,
        //         },
        //     }),
        //     ...(category && {
        //         categories: {
        //             some: {
        //                 category: {
        //                     slug: category,
        //                 },
        //             },
        //         },
        //     }),
        // },
        where,
        include: {
            images: true,
            categories: {
                include: {
                    category: true,
                },
            },
        },
        take: limit,
    });

    return products.map(mapProductToDto);
}

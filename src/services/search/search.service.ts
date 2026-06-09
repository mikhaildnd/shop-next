import { prisma } from '@/lib/db';
import { mapProductToDto } from '@/lib/mappers/product.mapper';
import { productInclude } from '@/lib/prisma/product';
import type { SearchResponse } from '@/services/search/types';
import { Prisma } from '@/generated/prisma/client';

const SEARCH_RESULTS_LIMIT = 5;

export async function search(query: string): Promise<SearchResponse> {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
        return {
            products: [],
            productsCount: 0,
            categories: [],
        };
    }

    const productWhere: Prisma.ProductWhereInput = {
        title: {
            contains: normalizedQuery,
            mode: 'insensitive',
        },
    };

    const categoryWhere: Prisma.CategoryWhereInput = {
        title: {
            contains: normalizedQuery,
            mode: 'insensitive',
        },
        // Если не нужна главная категория
        // children: {
        //     none: {},
        // },
    };

    const [products, productsCount, categories] = await Promise.all([
        prisma.product.findMany({
            where: productWhere,
            include: productInclude,
            take: SEARCH_RESULTS_LIMIT,
        }),

        prisma.product.count({
            where: productWhere,
        }),

        prisma.category.findMany({
            where: categoryWhere,
            take: SEARCH_RESULTS_LIMIT,
        }),
    ]);

    return {
        products: products.map(mapProductToDto),
        productsCount,
        categories,
    };
}

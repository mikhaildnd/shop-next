import { cache } from 'react';

import { prisma } from '@/db';
import { getProductWhere } from '@/services/product/filters/get-product-where';
import { productInclude } from '@/services/product/product.constants';
import { mapProductToDto } from '@/services/product/product.mapper';
import type {
    ProductDto,
    ProductsDataWithCount,
} from '@/services/product/product.types';
import { getProductsByWhere } from '@/services/product/queries/get-products-by-where';

export async function getProductsByCollection(
    collectionSlug: string,
    take?: number,
): Promise<ProductDto[]> {
    const result = await getProductsByWhere({
        take,
        where: {
            collections: {
                some: {
                    collection: {
                        slug: collectionSlug,
                    },
                },
            },
        },
    });

    return result.products;
}

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

export async function searchProducts(
    query: string,
    take: number,
): Promise<ProductsDataWithCount> {
    const where = getProductWhere({
        query,
    });

    return getProductsByWhere({
        where,
        take,
        includeCount: true,
    });
}

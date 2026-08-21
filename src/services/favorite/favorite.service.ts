import { prisma } from '@/db';
import type {
    GetFavoriteProductsByIdsParams,
    GetFavoriteProductsParams,
} from '@/services/favorite/favorite.types';
import { mapProductsToListingItems } from '@/services/product/product.mapper';
import { getProducts } from '@/services/product/product.service';

export async function getFavoriteProducts({
    userId,
    listing,
    pagination,
}: GetFavoriteProductsParams) {
    const result = await getProducts({
        favoritesForUserId: userId,
        ...listing,
        take: pagination.take,
        skip: pagination.skip,
    });

    return {
        ...result,
        products: mapProductsToListingItems(result.products, true),
        sort: listing.sort,
        currentPage: pagination.currentPage,
        startPage: pagination.startPage,
    };
}

export async function getFavoriteProductsByIds({
    favoriteIds,
    listing,
    pagination,
}: GetFavoriteProductsByIdsParams) {
    const result = await getProducts({
        favoriteIds,
        ...listing,
        take: pagination.take,
        skip: pagination.skip,
    });

    return {
        ...result,
        products: mapProductsToListingItems(result.products, true),
        sort: listing.sort,
        currentPage: pagination.currentPage,
        startPage: pagination.startPage,
    };
}

export async function addFavorite(
    userId: string,
    productId: string,
): Promise<void> {
    await prisma.favorite.upsert({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
        update: {},
        create: {
            userId,
            productId,
        },
    });
}

export async function removeFavorite(
    userId: string,
    productId: string,
): Promise<void> {
    await prisma.favorite.deleteMany({
        where: {
            userId,
            productId,
        },
    });
}

export async function getFavoriteCount(userId: string): Promise<number> {
    return prisma.favorite.count({
        where: {
            userId,
        },
    });
}

export async function mergeFavorites(
    userId: string,
    productIds: string[],
): Promise<number> {
    if (productIds.length > 0) {
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
            select: {
                id: true,
            },
        });

        await prisma.favorite.createMany({
            data: products.map(({ id }) => ({
                userId,
                productId: id,
            })),
            skipDuplicates: true,
        });
    }

    return prisma.favorite.count({
        where: {
            userId,
        },
    });
}

export async function getFavoriteProductIds(
    userId: string,
    productIds: string[],
): Promise<string[]> {
    const favorites = await prisma.favorite.findMany({
        where: {
            userId,
            productId: {
                in: productIds,
            },
        },
        select: {
            productId: true,
        },
    });

    return favorites.map(({ productId }) => productId);
}

import { prisma } from '@/db';

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

export async function mergeFavorites(
    userId: string,
    productIds: string[],
): Promise<string[]> {
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

    const favorites = await prisma.favorite.findMany({
        where: {
            userId,
        },
        select: {
            productId: true,
        },
    });

    return favorites.map(({ productId }) => productId);
}

export async function getFavoriteIds(userId: string): Promise<string[]> {
    const favorites = await prisma.favorite.findMany({
        where: {
            userId,
        },
        select: {
            productId: true,
        },
    });

    return favorites.map(({ productId }) => productId);
}

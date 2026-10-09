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

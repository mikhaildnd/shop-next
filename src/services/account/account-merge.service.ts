import { randomUUID } from 'node:crypto';

import { prisma } from '@/db';

export async function mergeAnonymousAccountData(
    anonymousUserId: string,
    userId: string,
): Promise<'merged' | 'unavailable'> {
    if (anonymousUserId === userId) {
        return 'unavailable';
    }

    return prisma.$transaction(async (tx) => {
        const operationId = randomUUID();

        const claim = await tx.user.updateMany({
            where: {
                id: anonymousUserId,
                isAnonymous: true,
                mergeTargetUserId: userId,
                mergeCompletedAt: null,
                mergeDismissedAt: null,
                mergeOperationId: null,
            },
            data: {
                mergeOperationId: operationId,
            },
        });

        if (claim.count !== 1) {
            return 'unavailable';
        }

        const anonymousCart = await tx.cart.findUnique({
            where: {
                userId: anonymousUserId,
            },
            include: {
                items: true,
            },
        });

        const anonymousFavorites = await tx.favorite.findMany({
            where: { userId: anonymousUserId },
            select: { productId: true },
        });

        if (anonymousCart?.items.length) {
            const userCart = await tx.cart.upsert({
                where: {
                    userId,
                },
                create: {
                    userId,
                },
                update: {},
            });

            for (const item of anonymousCart.items) {
                await tx.cartItem.upsert({
                    where: {
                        cartId_productId: {
                            cartId: userCart.id,
                            productId: item.productId,
                        },
                    },
                    create: {
                        cartId: userCart.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        quantityAdjustedFrom: null,
                        snapshotEffectivePrice: item.snapshotEffectivePrice,
                        isSelected: item.isSelected,
                    },
                    update: {
                        quantity: item.quantity,
                        quantityAdjustedFrom: null,
                        snapshotEffectivePrice: item.snapshotEffectivePrice,
                        isSelected: item.isSelected,
                    },
                });
            }

            await tx.cartItem.deleteMany({
                where: {
                    cartId: anonymousCart.id,
                },
            });
        }

        if (anonymousFavorites.length) {
            await tx.favorite.createMany({
                data: anonymousFavorites.map(({ productId }) => ({
                    userId,
                    productId,
                })),
                skipDuplicates: true,
            });
        }

        await tx.favorite.deleteMany({
            where: {
                userId: anonymousUserId,
            },
        });

        const completion = await tx.user.updateMany({
            where: {
                id: anonymousUserId,
                mergeOperationId: operationId,
                mergeCompletedAt: null,
                mergeDismissedAt: null,
            },
            data: {
                mergeCompletedAt: new Date(),
                mergeOperationId: null,
            },
        });

        if (completion.count !== 1) {
            throw new Error('Failed to complete account merge');
        }

        return 'merged';
    });
}

export async function cleanupMergedAnonymousUsers(
    userId: string,
    deleteUser: (anonymousUserId: string) => Promise<unknown>,
): Promise<void> {
    const anonymousUsers = await prisma.user.findMany({
        where: {
            mergeTargetUserId: userId,
            isAnonymous: true,
            OR: [
                { mergeCompletedAt: { not: null } },
                { mergeDismissedAt: { not: null } },
            ],
        },
        select: { id: true },
    });

    for (const anonymousUser of anonymousUsers) {
        try {
            await deleteUser(anonymousUser.id);
        } catch (error) {
            console.error('Failed to delete merged anonymous user', {
                anonymousUserId: anonymousUser.id,
                userId,
                error,
            });
        }
    }
}

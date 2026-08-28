import { prisma } from '@/db';
import type { CartEntry } from '@/lib/cart/cart.types';
import type { CartDto } from '@/services/cart/cart.types';
import { productInclude } from '@/services/product/product.constants';
import { mapProductToDto } from '@/services/product/product.mapper';

export async function getCart(userId: string): Promise<CartDto> {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        include: {
            items: {
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    product: {
                        include: productInclude,
                    },
                },
            },
        },
    });

    if (!cart) {
        return {
            items: [],
        };
    }

    return {
        items: cart.items.map((item) => ({
            product: mapProductToDto(item.product),
            quantity: item.quantity,
        })),
    };
}

export async function addCartItem(
    userId: string,
    productId: string,
): Promise<void> {
    await prisma.$transaction(async (tx) => {
        const cart = await tx.cart.upsert({
            where: {
                userId,
            },
            create: {
                userId,
            },
            update: {},
        });

        await tx.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
            create: {
                cartId: cart.id,
                productId,
                quantity: 1,
            },
            update: {},
        });
    });
}

export async function incrementCartItem(
    userId: string,
    productId: string,
): Promise<void> {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!cart) {
        return;
    }

    await prisma.cartItem.updateMany({
        where: {
            cartId: cart.id,
            productId,
        },
        data: {
            quantity: {
                increment: 1,
            },
        },
    });
}

export async function decrementCartItem(
    userId: string,
    productId: string,
): Promise<void> {
    await prisma.$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({
            where: {
                userId,
            },
            select: {
                id: true,
            },
        });

        if (!cart) {
            return;
        }

        const cartItem = await tx.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
            select: {
                quantity: true,
            },
        });

        if (!cartItem) {
            return;
        }

        if (cartItem.quantity === 1) {
            await tx.cartItem.delete({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId,
                    },
                },
            });

            return;
        }

        await tx.cartItem.update({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
            data: {
                quantity: {
                    decrement: 1,
                },
            },
        });
    });
}

export async function removeCartItem(
    userId: string,
    productId: string,
): Promise<void> {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!cart) {
        return;
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
            productId,
        },
    });
}

export async function clearCart(userId: string): Promise<void> {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!cart) {
        return;
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
        },
    });
}

export async function mergeCart(
    userId: string,
    entries: CartEntry[],
): Promise<CartDto> {
    const cart = await prisma.cart.upsert({
        where: {
            userId,
        },
        update: {},
        create: {
            userId,
        },
    });

    await prisma.$transaction(
        entries.map(({ productId, quantity }) =>
            prisma.cartItem.upsert({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId,
                    },
                },
                update: {
                    quantity,
                },
                create: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            }),
        ),
    );

    return getCart(userId);
}

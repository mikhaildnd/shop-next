import { cache } from 'react';

import { prisma } from '@/db';
import type { CartEntry, CartProductSnapshot } from '@/lib/cart/cart.types';
import type {
    CartDto,
    CartItemDto,
    CartProduct,
    CartProductLookup,
} from '@/services/cart/cart.types';

const cartProductSelect = {
    title: true,
    slug: true,
    stock: true,
    regularPrice: true,
    effectivePrice: true,
    discountPercent: true,
} as const;

function mapCartProduct(product: {
    slug: string;
    stock: number;
    regularPrice: { toString(): string };
    effectivePrice: { toString(): string } | null;
    discountPercent: number | null;
}): CartProduct {
    if (product.effectivePrice === null) {
        throw new Error('Product has null effectivePrice');
    }

    return {
        slug: product.slug,
        stock: product.stock,
        regularPrice: Number(product.regularPrice),
        effectivePrice: Number(product.effectivePrice),
        discountPercent: product.discountPercent ?? 0,
    };
}

function mapCartItem(item: {
    productId: string;
    quantity: number;
    snapshotTitle: string;
    snapshotImageUrl: string | null;
    snapshotEffectivePrice: { toString(): string };
}): CartItemDto {
    return {
        productId: item.productId,
        quantity: item.quantity,
        snapshot: {
            title: item.snapshotTitle,
            imageUrl: item.snapshotImageUrl,
            effectivePrice: Number(item.snapshotEffectivePrice),
        },
    };
}

export const getCart = cache(async (userId: string): Promise<CartDto> => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        include: {
            items: {
                orderBy: {
                    createdAt: 'desc',
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
        items: cart.items.map(mapCartItem),
    };
});

export const getCartProductsByIds = cache(
    async (productIds: string[]): Promise<CartProductLookup[]> => {
        if (productIds.length === 0) {
            return [];
        }

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
            select: {
                id: true,
                ...cartProductSelect,
            },
        });

        return products.map((product) => ({
            productId: product.id,
            title: product.title,
            ...mapCartProduct(product),
        }));
    },
);

export async function addCartItem(
    userId: string,
    productId: string,
    snapshot: CartProductSnapshot,
): Promise<void> {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            stock: true,
        },
    });

    if (!product) {
        throw new Error('Product not found');
    }

    if (product.stock < 1) {
        throw new Error('Product is out of stock');
    }

    const cart = await prisma.cart.upsert({
        where: {
            userId,
        },
        create: {
            userId,
        },
        update: {},
    });

    await prisma.cartItem.upsert({
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
            snapshotTitle: snapshot.title,
            snapshotImageUrl: snapshot.imageUrl,
            snapshotEffectivePrice: snapshot.effectivePrice,
        },
        update: {},
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

    const cartItem = await prisma.cartItem.findUnique({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
        select: {
            quantity: true,
            product: {
                select: {
                    stock: true,
                },
            },
        },
    });

    if (!cartItem) {
        return;
    }

    if (cartItem.quantity >= cartItem.product.stock) {
        throw new Error('Not enough product stock');
    }

    await prisma.cartItem.update({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
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

    const cartItem = await prisma.cartItem.findUnique({
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
        await prisma.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        return;
    }

    await prisma.cartItem.update({
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

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: entries.map((entry) => entry.productId),
            },
        },
        select: {
            id: true,
        },
    });

    const productIds = new Set(products.map((product) => product.id));
    const validEntries = entries.filter((entry) =>
        productIds.has(entry.productId),
    );

    if (validEntries.length > 0) {
        await prisma.$transaction(
            validEntries.map(({ productId, quantity, snapshot }) =>
                prisma.cartItem.upsert({
                    where: {
                        cartId_productId: {
                            cartId: cart.id,
                            productId,
                        },
                    },
                    update: {
                        quantity,
                        snapshotTitle: snapshot.title,
                        snapshotImageUrl: snapshot.imageUrl,
                        snapshotEffectivePrice: snapshot.effectivePrice,
                    },
                    create: {
                        cartId: cart.id,
                        productId,
                        quantity,
                        snapshotTitle: snapshot.title,
                        snapshotImageUrl: snapshot.imageUrl,
                        snapshotEffectivePrice: snapshot.effectivePrice,
                    },
                }),
            ),
        );
    }

    return getCart(userId);
}

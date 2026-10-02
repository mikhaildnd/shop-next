import { cache } from 'react';

import { prisma } from '@/db';
import type { CartItemSnapshot, CartProduct } from '@/lib/cart/cart.types';
import type {
    CartData,
    CartDto,
    CartItemDto,
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
    id: string;
    title: string;
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
        productId: product.id,
        title: product.title,
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
    quantityAdjustedFrom: number | null;
    snapshotTitle: string;
    snapshotImageUrl: string | null;
    snapshotEffectivePrice: { toString(): string };
}): CartItemDto {
    return {
        productId: item.productId,
        quantity: item.quantity,
        quantityAdjustedFrom: item.quantityAdjustedFrom,
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

export async function getCartData(userId: string): Promise<CartData> {
    const cart = await getCart(userId);
    const products = await getCartProductsByIds(
        cart.items.map((item) => item.productId),
    );

    return {
        cart,
        products,
    };
}

export async function reconcileCartQuantities(
    userId: string,
): Promise<CartDto> {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
            items: {
                select: {
                    productId: true,
                    quantity: true,
                    quantityAdjustedFrom: true,
                },
            },
        },
    });

    if (!cart || cart.items.length === 0) {
        return { items: [] };
    }

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: cart.items.map((item) => item.productId),
            },
        },
        select: {
            id: true,
            stock: true,
        },
    });

    const stockByProductId = new Map(
        products.map((product) => [product.id, product.stock]),
    );

    const updates = cart.items.flatMap((item) => {
        const stock = stockByProductId.get(item.productId);

        if (stock === undefined || stock <= 0) {
            return [];
        }

        if (item.quantity > stock) {
            return [
                prisma.cartItem.update({
                    where: {
                        cartId_productId: {
                            cartId: cart.id,
                            productId: item.productId,
                        },
                    },
                    data: {
                        quantity: stock,
                        quantityAdjustedFrom: item.quantity,
                    },
                }),
            ];
        }

        if (
            item.quantityAdjustedFrom !== null &&
            stock >= item.quantityAdjustedFrom
        ) {
            return [
                prisma.cartItem.update({
                    where: {
                        cartId_productId: {
                            cartId: cart.id,
                            productId: item.productId,
                        },
                    },
                    data: {
                        quantityAdjustedFrom: null,
                    },
                }),
            ];
        }

        return [];
    });

    if (updates.length > 0) {
        await prisma.$transaction(updates);
    }

    return getCart(userId);
}

export const getCartProductsByIds = cache(
    async (productIds: string[]): Promise<CartProduct[]> => {
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

        return products.map(mapCartProduct);
    },
);

export async function addCartItem(
    userId: string,
    productId: string,
    snapshot: CartItemSnapshot,
): Promise<CartData> {
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
            quantityAdjustedFrom: null,
            snapshotTitle: snapshot.title,
            snapshotImageUrl: snapshot.imageUrl,
            snapshotEffectivePrice: snapshot.effectivePrice,
        },
        update: {},
    });

    return getCartData(userId);
}

export async function incrementCartItem(
    userId: string,
    productId: string,
): Promise<CartData> {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!cart) {
        return getCartData(userId);
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
        return getCartData(userId);
    }

    if (cartItem.quantity >= cartItem.product.stock) {
        await reconcileCartQuantities(userId);

        return getCartData(userId);
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
            quantityAdjustedFrom: null,
        },
    });

    await reconcileCartQuantities(userId);

    return getCartData(userId);
}

export async function decrementCartItem(
    userId: string,
    productId: string,
): Promise<CartData> {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!cart) {
        return getCartData(userId);
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
        return getCartData(userId);
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

        await reconcileCartQuantities(userId);

        return getCartData(userId);
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
            quantityAdjustedFrom: null,
        },
    });

    await reconcileCartQuantities(userId);

    return getCartData(userId);
}

export async function removeCartItem(
    userId: string,
    productId: string,
): Promise<CartData> {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!cart) {
        return getCartData(userId);
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
            productId,
        },
    });

    return getCartData(userId);
}

export async function clearCart(userId: string): Promise<CartData> {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!cart) {
        return getCartData(userId);
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
        },
    });

    return getCartData(userId);
}

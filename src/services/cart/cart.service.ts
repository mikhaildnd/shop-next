import { cache } from 'react';

import { prisma } from '@/db';
import type { CartItemSnapshot, CartProduct } from '@/lib/cart/cart.types';
import { getCartQuantityAdjustments } from '@/lib/cart/get-cart-quantity-adjustments';
import type {
    CartData,
    CartDto,
    CartItemDto,
    CartQuantityAdjustment,
} from '@/services/cart/cart.types';
import type { MeasureType } from '@/services/product/product.types';

const cartProductSelect = {
    title: true,
    slug: true,
    images: {
        orderBy: {
            sortOrder: 'asc',
        },
        take: 1,
        select: {
            url: true,
        },
    },
    stock: true,
    regularPrice: true,
    effectivePrice: true,
    discountPercent: true,
    measureType: true,
    measureValue: true,
} as const;

function mapCartProduct(product: {
    id: string;
    title: string;
    slug: string;
    images: {
        url: string;
    }[];
    stock: number;
    regularPrice: { toString(): string };
    effectivePrice: { toString(): string } | null;
    discountPercent: number | null;
    measureType: MeasureType;
    measureValue: { toString(): string };
}): CartProduct {
    if (product.effectivePrice === null) {
        throw new Error('Product has null effectivePrice');
    }

    return {
        productId: product.id,
        title: product.title,
        slug: product.slug,
        imageUrl: product.images[0]?.url ?? null,
        stock: product.stock,
        regularPrice: Number(product.regularPrice),
        effectivePrice: Number(product.effectivePrice),
        discountPercent: product.discountPercent ?? 0,
        measureType: product.measureType,
        measureValue: Number(product.measureValue),
    };
}

function mapCartItem(item: {
    productId: string;
    quantity: number;
    quantityAdjustedFrom: number | null;
    snapshotEffectivePrice: { toString(): string };
}): CartItemDto {
    return {
        productId: item.productId,
        quantity: item.quantity,
        quantityAdjustedFrom: item.quantityAdjustedFrom,
        snapshot: {
            effectivePrice: Number(item.snapshotEffectivePrice),
        },
    };
}

export const getCart = async (userId: string): Promise<CartDto> => {
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
};

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

export async function applyCartQuantityAdjustments(
    userId: string,
    adjustments: CartQuantityAdjustment[],
): Promise<void> {
    if (adjustments.length === 0) {
        return;
    }

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

    await prisma.$transaction(
        adjustments.map((adjustment) =>
            prisma.cartItem.update({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId: adjustment.productId,
                    },
                },
                data: {
                    quantity: adjustment.quantity,
                    quantityAdjustedFrom: adjustment.quantityAdjustedFrom,
                },
            }),
        ),
    );
}

export async function getReconciledCartData(userId: string): Promise<CartData> {
    const cartData = await getCartData(userId);

    const adjustments = getCartQuantityAdjustments(
        cartData.cart,
        cartData.products,
    );

    if (adjustments.length === 0) {
        return cartData;
    }

    await applyCartQuantityAdjustments(userId, adjustments);

    return getCartData(userId);
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
            snapshotEffectivePrice: snapshot.effectivePrice,
        },
        update: {},
    });

    return getCartData(userId);
}

export async function setCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
): Promise<void> {
    if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
    }

    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!cart) {
        throw new Error('Cart not found');
    }

    await prisma.cartItem.update({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
        data: {
            quantity,
            quantityAdjustedFrom: null,
        },
    });
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

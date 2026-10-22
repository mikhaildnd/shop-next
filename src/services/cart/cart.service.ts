import { cache } from 'react';

import { prisma } from '@/db';
import type { Prisma } from '@/generated/prisma/client';
import type { CartProduct } from '@/lib/cart/cart.types';
import { getCartQuantityAdjustments } from '@/lib/cart/get-cart-quantity-adjustments';
import type {
    CartData,
    CartDto,
    CartItemDto,
    CartQuantityAdjustment,
    UpdateCartItemPriceSnapshotsResult,
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
} as const satisfies Prisma.ProductSelect;

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

async function getCartItems(userId: string): Promise<CartDto> {
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
}

const getCartProductsByIds = cache(
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

async function getCart(userId: string): Promise<CartData> {
    const cart = await getCartItems(userId);
    const products = await getCartProductsByIds(
        cart.items.map((item) => item.productId),
    );

    return {
        cart,
        products,
    };
}

async function applyCartQuantityAdjustments(
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
        throw new Error('Cart not found');
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

export async function getReconciledCart(userId: string): Promise<CartData> {
    const cartData = await getCart(userId);

    const adjustments = getCartQuantityAdjustments(
        cartData.cart,
        cartData.products,
    );

    if (adjustments.length === 0) {
        return cartData;
    }

    await applyCartQuantityAdjustments(userId, adjustments);

    const updatedItems = cartData.cart.items.map((item) => {
        const adjustment = adjustments.find(
            (adjustment) => adjustment.productId === item.productId,
        );

        if (!adjustment) {
            return item;
        }

        return {
            ...item,
            quantity: adjustment.quantity,
            quantityAdjustedFrom: adjustment.quantityAdjustedFrom,
        };
    });

    const updatedCart = {
        ...cartData.cart,
        items: updatedItems,
    };

    return {
        ...cartData,
        cart: updatedCart,
    };
}

export async function addCartItem(
    userId: string,
    productId: string,
): Promise<CartData> {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            stock: true,
            effectivePrice: true,
        },
    });

    if (!product) {
        throw new Error('Product not found');
    }

    if (product.stock < 1) {
        throw new Error('Product is out of stock');
    }

    if (product.effectivePrice === null) {
        throw new Error('Product has null effectivePrice');
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
            snapshotEffectivePrice: product.effectivePrice,
        },
        update: {},
    });

    return getReconciledCart(userId);
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
        throw new Error('Cart not found');
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
            productId,
        },
    });

    return getReconciledCart(userId);
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
        throw new Error('Cart not found');
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
        },
    });

    return {
        cart: {
            items: [],
        },
        products: [],
    };
}

export async function updateCartItemPriceSnapshots(
    userId: string,
    confirmations: {
        productId: string;
        effectivePrice: number;
    }[],
): Promise<UpdateCartItemPriceSnapshotsResult> {
    const updatedProductIds: string[] = [];
    const changedProducts: CartData['products'] = [];

    for (const confirmation of confirmations) {
        const updated = await prisma.cartItem.updateMany({
            where: {
                cart: {
                    userId,
                },
                productId: confirmation.productId,
                product: {
                    stock: {
                        gt: 0,
                    },
                    effectivePrice: confirmation.effectivePrice,
                },
            },
            data: {
                snapshotEffectivePrice: confirmation.effectivePrice,
            },
        });

        if (updated.count > 0) {
            updatedProductIds.push(confirmation.productId);
            continue;
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                cart: { userId },
                productId: confirmation.productId,
                product: {
                    stock: { gt: 0 },
                    effectivePrice: {
                        not: confirmation.effectivePrice,
                    },
                },
            },
            select: {
                product: {
                    select: {
                        id: true,
                        ...cartProductSelect,
                    },
                },
            },
        });

        if (cartItem) {
            changedProducts.push(mapCartProduct(cartItem.product));
        }
    }

    return {
        updatedProductIds,
        changedProducts,
    };
}

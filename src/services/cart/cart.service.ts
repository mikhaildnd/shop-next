import { prisma } from '@/db';
import type { Prisma } from '@/generated/prisma/client';
import type { CartProduct } from '@/lib/cart/cart.types';
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
    isSelected: boolean;
    snapshotEffectivePrice: { toString(): string };
}): CartItemDto {
    return {
        productId: item.productId,
        quantity: item.quantity,
        quantityAdjustedFrom: item.quantityAdjustedFrom,
        isSelected: item.isSelected,
        snapshot: {
            effectivePrice: Number(item.snapshotEffectivePrice),
        },
    };
}

async function getCart(userId: string): Promise<CartData> {
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
            cart: {
                items: [],
            },
            products: [],
        };
    }

    const cartDto: CartDto = {
        items: cart.items.map(mapCartItem),
    };

    if (cartDto.items.length === 0) {
        return {
            cart: cartDto,
            products: [],
        };
    }

    const cartProductIds = cartDto.items.map((item) => item.productId);

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: cartProductIds,
            },
        },
        select: {
            id: true,
            ...cartProductSelect,
        },
    });

    return {
        cart: cartDto,
        products: products.map(mapCartProduct),
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
): Promise<void> {
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
        throw new Error('Cart not found');
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
            productId,
        },
    });
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
): Promise<void> {
    await prisma.$transaction(async (tx) => {
        for (const confirmation of confirmations) {
            await tx.cartItem.updateMany({
                where: {
                    cart: {
                        userId,
                    },
                    productId: confirmation.productId,
                    product: {
                        stock: { gt: 0 },
                        effectivePrice: confirmation.effectivePrice,
                    },
                },
                data: {
                    snapshotEffectivePrice: confirmation.effectivePrice,
                },
            });
        }
    });
}

export async function setCartItemSelection(
    userId: string,
    productId: string,
    isSelected: boolean,
): Promise<void> {
    const result = await prisma.cartItem.updateMany({
        where: {
            cart: {
                userId,
            },
            productId,
            product: {
                stock: { gt: 0 },
            },
        },
        data: {
            isSelected,
        },
    });

    if (result.count === 0) {
        throw new Error('Cart item selection could not be updated');
    }
}

export async function setAllCartItemsSelection(
    userId: string,
    isSelected: boolean,
): Promise<void> {
    await prisma.cartItem.updateMany({
        where: {
            cart: {
                userId,
            },
            product: {
                stock: { gt: 0 },
            },
        },
        data: {
            isSelected,
        },
    });
}

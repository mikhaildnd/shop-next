import type { CartProductSnapshot } from '@/lib/cart/cart.types';

export type CartProduct = {
    slug: string;
    stock: number;
    regularPrice: number;
    effectivePrice: number;
    discountPercent: number;
};

export type CartProductLookup = CartProduct & {
    productId: string;
    title: string;
};

export type CartItemDto = {
    productId: string;
    quantity: number;
    snapshot: CartProductSnapshot;
    product: CartProduct;
};

export type CartDto = {
    items: CartItemDto[];
};

import type { CartItemSnapshot, CartProduct } from '@/lib/cart/cart.types';

export type CartItemDto = {
    productId: string;
    quantity: number;
    quantityAdjustedFrom: number | null;
    snapshot: CartItemSnapshot;
};

export type CartDto = {
    items: CartItemDto[];
};

export type CartData = {
    cart: CartDto;
    products: CartProduct[];
};

export type CartQuantityAdjustment = {
    productId: string;
    quantity: number;
    quantityAdjustedFrom: number | null;
};

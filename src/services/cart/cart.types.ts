import type { CartItemSnapshot, CartProduct } from '@/lib/cart/cart.types';

export type CartItemDto = {
    productId: string;
    quantity: number;
    snapshot: CartItemSnapshot;
};

export type CartDto = {
    items: CartItemDto[];
};

export type CartInitialData = {
    cart: CartDto;
    products: CartProduct[];
};

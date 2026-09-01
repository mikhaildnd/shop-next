import type { CartProductSnapshot } from '@/lib/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

export type CartItemDto = {
    product: ProductDto;
    quantity: number;
    snapshot: CartProductSnapshot;
};

export type CartDto = {
    items: CartItemDto[];
};

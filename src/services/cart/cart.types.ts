import type { ProductDto } from '@/services/product/product.types';

export type CartItemDto = {
    product: ProductDto;
    quantity: number;
};

export type CartDto = {
    items: CartItemDto[];
};

import type { MeasureType } from '@/services/product/product.types';

export type CartProduct = {
    productId: string;
    title: string;
    slug: string;
    imageUrl: string | null;
    stock: number;
    regularPrice: number;
    effectivePrice: number;
    discountPercent: number;
    measureType: MeasureType;
    measureValue: number;
};

export type CartItemSnapshot = {
    title: string;
    imageUrl: string | null;
    effectivePrice: number;
};

export type CartItemData = {
    productId: string;
    quantity: number;
    displayQuantity: number;
    quantityAdjustedFrom: number | null;
    snapshot: CartItemSnapshot;
    product: CartProduct;
};

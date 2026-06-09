import type { ProductDto } from '@/services/product/product.types';

const calculateDiscountPrice = (price: number, discount: number): number => {
    return discount > 0 ? price * (1 - discount / 100) : price;
};

export const getProductPricing = (product: ProductDto) => {
    const regularPrice = product.basePrice;

    const hasDiscount = product.discountPercent > 0;

    const discountedPrice = hasDiscount
        ? calculateDiscountPrice(regularPrice, product.discountPercent)
        : regularPrice;

    return {
        regularPrice,
        discountedPrice,
        hasDiscount,
    };
};

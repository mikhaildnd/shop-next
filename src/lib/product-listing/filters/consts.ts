export const DISCOUNT_FILTER_VALUES = [10, 20, 30] as const;

export const PRODUCT_FILTER_PARAMS = {
    sale: 'sale',
    inStock: 'inStock',
    discount: 'discount',
    priceFrom: 'priceFrom',
    priceTo: 'priceTo',
} as const;

export const PRODUCT_FILTER_LISTING_ISSUES = {
    INVALID_SALE: 'invalid-sale',
    INVALID_DISCOUNT: 'invalid-discount',
    INVALID_PRICE_FROM: 'invalid-price-from',
    INVALID_PRICE_TO: 'invalid-price-to',
    INVALID_IN_STOCK: 'invalid-in-stock',
} as const;

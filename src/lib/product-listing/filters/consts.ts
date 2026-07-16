import type { ProductFilters } from '@/lib/product-listing/filters/types';

export const DISCOUNT_FILTER_VALUES = [10, 20, 30] as const;

export const PRODUCT_FILTER_PARAMS = {
    SALE: 'sale',
    IN_STOCK: 'inStock',
    DISCOUNT: 'discount',
    PRICE_FROM: 'priceFrom',
    PRICE_TO: 'priceTo',
} as const;

export const PRODUCT_FILTER_LISTING_ISSUES = {
    INVALID_SALE: 'invalid-sale',
    INVALID_DISCOUNT: 'invalid-discount',
    INVALID_PRICE_FROM: 'invalid-price-from',
    INVALID_PRICE_TO: 'invalid-price-to',
    INVALID_IN_STOCK: 'invalid-in-stock',
} as const;

export const DEFAULT_PRODUCT_FILTERS = {
    query: null,
    sale: false,
    inStock: true,
    discount: null,
    priceFrom: null,
    priceTo: null,
} satisfies ProductFilters;

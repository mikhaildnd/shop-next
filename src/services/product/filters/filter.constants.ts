import type { ProductFilters } from '@/services/product/filters/filter.types';

export const DEFAULT_PRODUCT_FILTERS = {
    query: null,
    sale: false,
    inStock: true,
    discount: null,
    priceFrom: null,
    priceTo: null,
} satisfies ProductFilters;

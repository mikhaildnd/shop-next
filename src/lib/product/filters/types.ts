import { DISCOUNT_FILTER_VALUES } from '@/lib/product/filters/consts';

export type ProductFilters = {
    query: string | null;
    sale: boolean;
    discount: number | null;
    priceFrom: number | null;
    priceTo: number | null;
    inStock: boolean;
};

export type DiscountFilterValue = (typeof DISCOUNT_FILTER_VALUES)[number];

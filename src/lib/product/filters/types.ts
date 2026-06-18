import { DISCOUNT_FILTER_VALUES } from '@/lib/product/filters/consts';

export type ProductFilters = {
    saleOnly: boolean;
    minDiscount: number | null;

    priceFrom: number | null;
    priceTo: number | null;
};

export type DiscountFilterValue = (typeof DISCOUNT_FILTER_VALUES)[number];

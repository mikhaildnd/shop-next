import {
    DISCOUNT_FILTER_VALUES,
    PRODUCT_FILTER_LISTING_ISSUES,
} from '@/lib/product-listing/filters/consts';

export type ProductFilters = {
    query: string | null;
    sale: boolean;
    discount: number | null;
    priceFrom: number | null;
    priceTo: number | null;
    inStock: boolean;
};

export type DiscountFilterValue = (typeof DISCOUNT_FILTER_VALUES)[number];

export type ProductFilterListingIssue =
    (typeof PRODUCT_FILTER_LISTING_ISSUES)[keyof typeof PRODUCT_FILTER_LISTING_ISSUES];

export type ProductFilterParseResult<T> = {
    value: T;
    issue?: ProductFilterListingIssue;
};

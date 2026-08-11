import {
    DEFAULT_PRODUCT_FILTERS,
    PRODUCT_FILTER_LISTING_ISSUES,
} from '@/lib/product-listing/filters/consts';
import { isDiscountFilterValue } from '@/lib/product-listing/filters/guard';
import type {
    ProductFilterParseResult,
    ProductFilters,
} from '@/lib/product-listing/filters/types';

export function parseDiscountParam(
    value: string | undefined,
): ProductFilterParseResult<ProductFilters['discount']> {
    if (value === undefined) {
        return {
            value: DEFAULT_PRODUCT_FILTERS.discount,
        };
    }

    const parsed = Number(value);

    if (!isDiscountFilterValue(parsed)) {
        return {
            value: DEFAULT_PRODUCT_FILTERS.discount,
            issue: PRODUCT_FILTER_LISTING_ISSUES.INVALID_DISCOUNT,
        };
    }

    return {
        value: parsed,
    };
}

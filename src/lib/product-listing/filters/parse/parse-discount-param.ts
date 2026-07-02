import { isDiscountFilterValue } from '@/lib/product-listing/filters/guard';
import type {
    ProductFilterParseResult,
    ProductFilters,
} from '@/lib/product-listing/filters/types';
import { PRODUCT_FILTER_LISTING_ISSUES } from '@/lib/product-listing/filters/consts';

export function parseDiscountParam(
    value: string | undefined,
): ProductFilterParseResult<ProductFilters['discount']> {
    if (value === undefined) {
        return {
            value: null,
        };
    }

    const parsed = Number(value);

    if (!isDiscountFilterValue(parsed)) {
        return {
            value: null,
            issue: PRODUCT_FILTER_LISTING_ISSUES.INVALID_DISCOUNT,
        };
    }

    return {
        value: parsed,
    };
}

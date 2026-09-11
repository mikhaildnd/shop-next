import { isDiscountFilterValue } from '@/app/(shop)/(catalog)/lib/product-listing/filters/guard';
import { PRODUCT_FILTER_LISTING_ISSUES } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductFilterParseResult } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import type { ProductFilters } from '@/services/product/filters/filter.types';

export function parseDiscountParam(
    value: string | undefined,
    defaultValue: ProductFilters['discount'],
): ProductFilterParseResult<ProductFilters['discount']> {
    if (value === undefined) {
        return {
            value: defaultValue,
        };
    }

    const parsed = Number(value);

    if (!isDiscountFilterValue(parsed)) {
        return {
            value: defaultValue,
            issue: PRODUCT_FILTER_LISTING_ISSUES.INVALID_DISCOUNT,
        };
    }

    return {
        value: parsed,
    };
}

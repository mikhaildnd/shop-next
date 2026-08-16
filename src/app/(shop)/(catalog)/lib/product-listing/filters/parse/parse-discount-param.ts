import { isDiscountFilterValue } from '@/app/(shop)/(catalog)/lib/product-listing/filters/guard';
import { PRODUCT_FILTER_LISTING_ISSUES } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductFilterParseResult } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { DEFAULT_PRODUCT_FILTERS } from '@/services/product/filters/filter.constants';
import type { ProductFilters } from '@/services/product/filters/filter.types';

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

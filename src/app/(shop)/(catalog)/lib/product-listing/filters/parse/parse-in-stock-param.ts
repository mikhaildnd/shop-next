import { PRODUCT_FILTER_LISTING_ISSUES } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductFilterParseResult } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import type { ProductFilters } from '@/services/product/filters/filter.types';

export function parseInStockParam(
    value: string | undefined,
    defaultValue: ProductFilters['inStock'],
): ProductFilterParseResult<ProductFilters['inStock']> {
    if (value === undefined) {
        return {
            value: defaultValue,
        };
    }

    if (value === 'true') {
        return {
            value: true,
        };
    }

    if (value === 'false') {
        return {
            value: false,
        };
    }

    return {
        value: defaultValue,
        issue: PRODUCT_FILTER_LISTING_ISSUES.INVALID_IN_STOCK,
    };
}

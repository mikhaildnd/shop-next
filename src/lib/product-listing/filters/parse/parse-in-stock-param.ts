import {
    DEFAULT_PRODUCT_FILTERS,
    PRODUCT_FILTER_LISTING_ISSUES,
} from '@/lib/product-listing/filters/consts';
import type {
    ProductFilterParseResult,
    ProductFilters,
} from '@/lib/product-listing/filters/types';

export function parseInStockParam(
    value: string | undefined,
): ProductFilterParseResult<ProductFilters['inStock']> {
    if (value === undefined) {
        return {
            value: DEFAULT_PRODUCT_FILTERS.inStock,
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
        value: DEFAULT_PRODUCT_FILTERS.inStock,
        issue: PRODUCT_FILTER_LISTING_ISSUES.INVALID_IN_STOCK,
    };
}

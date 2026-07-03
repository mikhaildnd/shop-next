import { PRODUCT_FILTER_LISTING_ISSUES } from '@/lib/product-listing/filters/consts';
import type {
    ProductFilterParseResult,
    ProductFilters,
} from '@/lib/product-listing/filters/types';

export function parseInStockParam(
    value: string | undefined,
): ProductFilterParseResult<ProductFilters['inStock']> {
    if (value === undefined) {
        return {
            value: false,
        };
    }

    if (value === 'true') {
        return {
            value: true,
        };
    }

    return {
        value: false,
        issue: PRODUCT_FILTER_LISTING_ISSUES.INVALID_IN_STOCK,
    };
}

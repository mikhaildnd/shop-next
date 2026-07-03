import { PRODUCT_FILTER_LISTING_ISSUES } from '@/lib/product-listing/filters/consts';
import type {
    ProductFilterParseResult,
    ProductFilters,
} from '@/lib/product-listing/filters/types';

export function parseSaleParam(
    value: string | undefined,
): ProductFilterParseResult<ProductFilters['sale']> {
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
        issue: PRODUCT_FILTER_LISTING_ISSUES.INVALID_SALE,
    };
}

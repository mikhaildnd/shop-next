import {
    DEFAULT_PRODUCT_FILTERS,
    PRODUCT_FILTER_LISTING_ISSUES,
} from '@/lib/product-listing/filters/consts';
import type {
    ProductFilterParseResult,
    ProductFilters,
} from '@/lib/product-listing/filters/types';

export function parsePriceFromParam(
    value?: string,
): ProductFilterParseResult<ProductFilters['priceFrom']> {
    if (value === undefined) {
        return {
            value: DEFAULT_PRODUCT_FILTERS.priceFrom,
        };
    }

    const price = Number(value);

    if (!Number.isFinite(price) || price < 0) {
        return {
            value: DEFAULT_PRODUCT_FILTERS.priceFrom,
            issue: PRODUCT_FILTER_LISTING_ISSUES.INVALID_PRICE_FROM,
        };
    }

    return {
        value: price,
    };
}

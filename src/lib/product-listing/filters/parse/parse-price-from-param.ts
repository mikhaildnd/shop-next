import { PRODUCT_FILTER_LISTING_ISSUES } from '@/lib/product-listing/filters/consts';
import type {
    ProductFilterParseResult,
    ProductFilters,
} from '@/lib/product-listing/filters/types';

export function parsePriceFromParam(
    value?: string,
): ProductFilterParseResult<ProductFilters['priceFrom']> {
    if (value === undefined) {
        return {
            value: null,
        };
    }

    const price = Number(value);

    if (!Number.isInteger(price) || price < 0) {
        return {
            value: null,
            issue: PRODUCT_FILTER_LISTING_ISSUES.INVALID_PRICE_FROM,
        };
    }

    return {
        value: price,
    };
}

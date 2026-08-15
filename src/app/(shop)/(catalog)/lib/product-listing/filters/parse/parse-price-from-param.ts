import { PRODUCT_FILTER_LISTING_ISSUES } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductFilterParseResult } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { DEFAULT_PRODUCT_FILTERS } from '@/services/product/filters/filter.constants';
import type { ProductFilters } from '@/services/product/filters/filter.types';

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

import { PRODUCT_FILTER_LISTING_ISSUES } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductFilterParseResult } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import type { ProductFilters } from '@/services/product/filters/filter.types';

export function parsePriceFromParam(
    value: string | undefined,
    defaultValue: ProductFilters['priceFrom'],
): ProductFilterParseResult<ProductFilters['priceFrom']> {
    if (value === undefined) {
        return {
            value: defaultValue,
        };
    }

    const price = Number(value);

    if (!Number.isFinite(price) || price < 0) {
        return {
            value: defaultValue,
            issue: PRODUCT_FILTER_LISTING_ISSUES.INVALID_PRICE_FROM,
        };
    }

    return {
        value: price,
    };
}

import { PRODUCT_FILTER_LISTING_ISSUES } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductFilterParseResult } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { DEFAULT_PRODUCT_FILTERS } from '@/services/product/filters/filter.constants';
import type { ProductFilters } from '@/services/product/filters/filter.types';

export function parseSaleParam(
    value: string | undefined,
): ProductFilterParseResult<ProductFilters['sale']> {
    if (value === undefined) {
        return {
            value: DEFAULT_PRODUCT_FILTERS.sale,
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
        value: DEFAULT_PRODUCT_FILTERS.sale,
        issue: PRODUCT_FILTER_LISTING_ISSUES.INVALID_SALE,
    };
}

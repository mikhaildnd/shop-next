import { PRODUCT_FILTER_LISTING_ISSUES } from '@/lib/product-listing/filters/consts';
import type {
    ProductFilterListingIssue,
    ProductFilterParseResult,
    ProductFilters,
} from '@/lib/product-listing/filters/types';

function parsePrice(
    value: string | undefined,
    issue: ProductFilterListingIssue,
): ProductFilterParseResult<number | null> {
    if (value === undefined) {
        return {
            value: null,
        };
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
        return {
            value: null,
            issue,
        };
    }

    return {
        value: parsed,
    };
}

export function parsePriceFromParam(
    value: string | undefined,
): ProductFilterParseResult<ProductFilters['priceFrom']> {
    return parsePrice(value, PRODUCT_FILTER_LISTING_ISSUES.INVALID_PRICE_FROM);
}

export function parsePriceToParam(
    value: string | undefined,
): ProductFilterParseResult<ProductFilters['priceTo']> {
    return parsePrice(value, PRODUCT_FILTER_LISTING_ISSUES.INVALID_PRICE_TO);
}

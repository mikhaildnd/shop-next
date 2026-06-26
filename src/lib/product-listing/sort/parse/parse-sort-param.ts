import {
    ProductSortListingIssue,
    ProductSort,
} from '@/lib/product-listing/sort/types';
import {
    DEFAULT_PRODUCT_SORT,
    PRODUCT_SORT_LISTING_ISSUES,
} from '@/lib/product-listing/sort/consts';
import { isProductSort } from '@/lib/product-listing/sort/guards';

export interface ParseSortParamResult {
    value: ProductSort;
    issue?: ProductSortListingIssue;
}

export function parseSortParam(
    value: string | undefined,
): ParseSortParamResult {
    if (value === undefined) {
        return {
            value: DEFAULT_PRODUCT_SORT,
        };
    }

    if (isProductSort(value)) {
        return {
            value,
        };
    }

    return {
        value: DEFAULT_PRODUCT_SORT,
        issue: PRODUCT_SORT_LISTING_ISSUES.INVALID_SORT,
    };
}

import { PRODUCT_SORT_LISTING_ISSUES } from '@/lib/product-listing/sort/consts';
import { isProductSort } from '@/lib/product-listing/sort/guards';
import type {
    ProductSort,
    ProductSortListingIssue,
} from '@/lib/product-listing/sort/types';

type ParseSortParamResult = {
    value?: ProductSort;
    issue?: ProductSortListingIssue;
};

export function parseSortParam(value?: string): ParseSortParamResult {
    if (value === undefined) {
        return {};
    }

    if (!isProductSort(value)) {
        return {
            issue: PRODUCT_SORT_LISTING_ISSUES.INVALID_SORT,
        };
    }

    return {
        value,
    };
}

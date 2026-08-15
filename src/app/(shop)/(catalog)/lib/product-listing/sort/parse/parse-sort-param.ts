import { PRODUCT_SORT_LISTING_ISSUES } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { ProductSortListingIssue } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { isProductSort } from '@/app/(shop)/(catalog)/lib/product-listing/sort/guard';
import type { ProductSort } from '@/services/product/sort/sort.types';

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

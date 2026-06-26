import { DEFAULT_PRODUCT_SORT } from '@/lib/product-listing/sort/consts';
import type { ProductSort } from '@/lib/product-listing/sort/types';
import { isProductSort } from '@/lib/product-listing/sort/guards';

export const normalizeSortParam = (value?: string): ProductSort => {
    if (value && isProductSort(value)) {
        return value;
    }

    return DEFAULT_PRODUCT_SORT;
};

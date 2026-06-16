import { DEFAULT_PRODUCT_SORT, PRODUCT_SORTS } from '@/lib/product/sort/consts';
import type { ProductSort } from '@/lib/product/sort/types';

export const normalizeSortParam = (value?: string): ProductSort => {
    if (value && PRODUCT_SORTS.includes(value as ProductSort)) {
        return value as ProductSort;
    }

    return DEFAULT_PRODUCT_SORT;
};

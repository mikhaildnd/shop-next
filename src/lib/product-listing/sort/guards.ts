import { PRODUCT_SORTS } from '@/lib/product-listing/sort/consts';
import type { ProductSort } from '@/lib/product-listing/sort/types';

const PRODUCT_SORT_SET = new Set<string>(PRODUCT_SORTS);

export function isProductSort(value: string): value is ProductSort {
    return PRODUCT_SORT_SET.has(value);
}

import { PRODUCT_SORTS } from '@/services/product/sort/sort.constants';
import type { ProductSort } from '@/services/product/sort/sort.types';

const PRODUCT_SORT_SET = new Set<string>(PRODUCT_SORTS);

export function isProductSort(value: string): value is ProductSort {
    return PRODUCT_SORT_SET.has(value);
}

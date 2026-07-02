import { DISCOUNT_FILTER_VALUES } from '@/lib/product-listing/filters/consts';
import type { DiscountFilterValue } from '@/lib/product-listing/filters/types';

const DISCOUNT_FILTER_SET = new Set<number>(DISCOUNT_FILTER_VALUES);

export function isDiscountFilterValue(
    value: number,
): value is DiscountFilterValue {
    return DISCOUNT_FILTER_SET.has(value);
}

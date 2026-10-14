import { DISCOUNT_FILTER_VALUES } from '@/app/(app)/(shop)/(catalog)/lib/product-listing/product-listing.constants';
import type { DiscountFilterValue } from '@/app/(app)/(shop)/(catalog)/lib/product-listing/product-listing.types';

const DISCOUNT_FILTER_SET = new Set<number>(DISCOUNT_FILTER_VALUES);

export function isDiscountFilterValue(
    value: number,
): value is DiscountFilterValue {
    return DISCOUNT_FILTER_SET.has(value);
}

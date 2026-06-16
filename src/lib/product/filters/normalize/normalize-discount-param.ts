import type { DiscountFilterValue } from '@/lib/product/filters/types';
import { DISCOUNT_FILTER_VALUES } from '@/lib/product/filters/consts';

export function normalizeDiscountParam(
    value?: string,
): DiscountFilterValue | null {
    const parsed = Number(value);

    return DISCOUNT_FILTER_VALUES.includes(parsed as DiscountFilterValue)
        ? (parsed as DiscountFilterValue)
        : null;
}

import type { DiscountFilterValue } from '@/lib/product/filters/types';
import { isDiscountFilterValue } from '@/lib/product/filters/guard';

export function normalizeDiscountParam(
    value?: string,
): DiscountFilterValue | null {
    const parsed = Number(value);

    if (!Number.isInteger(parsed)) {
        return null;
    }

    return isDiscountFilterValue(parsed) ? parsed : null;
}

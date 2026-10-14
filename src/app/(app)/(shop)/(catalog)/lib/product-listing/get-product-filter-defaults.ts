import { DEFAULT_PRODUCT_FILTERS } from '@/services/product/filters/filter.constants';
import type { ProductFilters } from '@/services/product/filters/filter.types';

export function getProductFilterDefaults(
    defaultFilterOverrides: Partial<ProductFilters> = {},
): ProductFilters {
    return {
        ...DEFAULT_PRODUCT_FILTERS,
        ...defaultFilterOverrides,
    };
}

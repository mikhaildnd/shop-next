import type { ProductSort } from '@/lib/product/sort/types';

export const PRODUCT_SORT_PARAM = 'sort';

export const DEFAULT_PRODUCT_SORT: ProductSort = 'newest';

export const PRODUCT_SORTS = [
    'newest',
    'popular',
    'price-asc',
    'price-desc',
    'name-asc',
    'name-desc',
] as const;

import type { ProductSort } from '@/services/product/sort/sort.types';

export const DEFAULT_PRODUCT_SORT: ProductSort = 'newest';

export const PRODUCT_SORTS = [
    'newest',
    'popular',
    'price-asc',
    'price-desc',
] as const;

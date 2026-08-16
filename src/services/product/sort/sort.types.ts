import type { PRODUCT_SORTS } from '@/services/product/sort/sort.constants';

export type ProductSort = (typeof PRODUCT_SORTS)[number];

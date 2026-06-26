import type { ProductSort } from '@/lib/product-listing/sort/types';

export const PRODUCT_SORT_PARAM = 'sort';

export const DEFAULT_PRODUCT_SORT: ProductSort = 'newest';

export const PRODUCT_SORTS = [
    'newest',
    'popular',
    'price-asc',
    'price-desc',
] as const;

export const PRODUCT_SORT_ITEMS = [
    {
        value: 'popular',
        label: 'Популярные',
    },
    {
        value: 'newest',
        label: 'Новинки',
    },
    {
        value: 'price-asc',
        label: 'Дешевле',
    },
    {
        value: 'price-desc',
        label: 'Дороже',
    },
] as const satisfies readonly {
    value: ProductSort;
    label: string;
}[];

import type { ProductSort } from '@/services/product/sort/sort.types';

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

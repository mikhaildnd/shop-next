import type { PaginationSearchParams } from '@/lib/pagination/types';

export type ProductSearchParams = PaginationSearchParams & {
    sort?: string;
    sale?: string;
    discount?: string;
    priceFrom?: string;
    priceTo?: string;
};

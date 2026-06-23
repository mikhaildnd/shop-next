import type { PaginationSearchParams } from '@/lib/pagination/types';
import { SEARCH_QUERY_PARAM } from '@/lib/search/consts';

export type ProductSearchParams = PaginationSearchParams & {
    [SEARCH_QUERY_PARAM]?: string;
    sort?: string;
    sale?: string;
    discount?: string;
    priceFrom?: string;
    priceTo?: string;
};

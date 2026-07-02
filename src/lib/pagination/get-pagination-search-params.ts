import type { PaginationSearchParams } from '@/lib/pagination/types';
import type { SearchParams } from '@/lib/url/types';
import { PAGINATION_PARAMS } from '@/lib/pagination/consts';

export function getPaginationSearchParams(
    searchParams: SearchParams,
): PaginationSearchParams {
    return {
        page: searchParams.get(PAGINATION_PARAMS.PAGE_QUERY_PARAM) ?? undefined,
        from: searchParams.get(PAGINATION_PARAMS.FROM_QUERY_PARAM) ?? undefined,
        view: searchParams.get(PAGINATION_PARAMS.VIEW_QUERY_PARAM) ?? undefined,
    };
}

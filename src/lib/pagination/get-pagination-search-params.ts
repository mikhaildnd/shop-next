import { PAGINATION_PARAMS } from '@/lib/pagination/pagination.constants';
import type { PaginationSearchParams } from '@/lib/pagination/pagination.types';
import type { SearchParams } from '@/lib/url/types';

export function getPaginationSearchParams(
    searchParams: SearchParams,
): PaginationSearchParams {
    return {
        page: searchParams.get(PAGINATION_PARAMS.PAGE_QUERY_PARAM) ?? undefined,
        from: searchParams.get(PAGINATION_PARAMS.FROM_QUERY_PARAM) ?? undefined,
        view: searchParams.get(PAGINATION_PARAMS.VIEW_QUERY_PARAM) ?? undefined,
    };
}

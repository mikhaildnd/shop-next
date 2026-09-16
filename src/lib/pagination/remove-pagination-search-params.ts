import { PAGINATION_PARAMS } from '@/lib/pagination/pagination.constants';

export function removePaginationSearchParams(params: URLSearchParams) {
    params.delete(PAGINATION_PARAMS.PAGE_QUERY_PARAM);
    params.delete(PAGINATION_PARAMS.VIEW_QUERY_PARAM);
    params.delete(PAGINATION_PARAMS.FROM_QUERY_PARAM);
}

import {
    PAGINATION_PARAMS,
    PAGINATION_VIEWS,
} from '@/lib/pagination/pagination.constants';
import type { PaginationState } from '@/lib/pagination/pagination.types';
import { removePaginationSearchParams } from '@/lib/pagination/remove-pagination-search-params';

type AppendPaginationSearchParamsOptions = {
    params: URLSearchParams;
    pagination: PaginationState;
};

export function appendPaginationSearchParams({
    params,
    pagination,
}: AppendPaginationSearchParamsOptions) {
    removePaginationSearchParams(params);

    if (pagination.currentPage > 1) {
        params.set(
            PAGINATION_PARAMS.PAGE_QUERY_PARAM,
            String(pagination.currentPage),
        );
    }

    if (pagination.view === PAGINATION_VIEWS.APPEND) {
        params.set(PAGINATION_PARAMS.VIEW_QUERY_PARAM, pagination.view);
        params.set(
            PAGINATION_PARAMS.FROM_QUERY_PARAM,
            String(pagination.startPage),
        );
    }
}

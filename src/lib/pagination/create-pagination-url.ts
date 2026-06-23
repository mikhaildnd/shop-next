import { updateSearchParams } from '../url/update-search-params';
import type { SearchParams } from '@/lib/url/types';
import { PAGINATION_VIEWS } from '@/lib/pagination/consts';

type CreatePaginationUrlParams = {
    searchParams: SearchParams;
    page: number;
};

type CreateLoadMoreUrlParams = {
    searchParams: SearchParams;
    page: number;
    from: number;
};

export function createPaginationUrl({
    searchParams,
    page,
}: CreatePaginationUrlParams) {
    return updateSearchParams({
        searchParams,
        params: {
            page: page > 1 ? page : undefined,
            view: undefined,
            from: undefined,
        },
    });
}

export function createLoadMoreUrl({
    searchParams,
    page,
    from,
}: CreateLoadMoreUrlParams) {
    return updateSearchParams({
        searchParams,
        params: {
            page,
            view: PAGINATION_VIEWS.APPEND,
            from,
        },
    });
}

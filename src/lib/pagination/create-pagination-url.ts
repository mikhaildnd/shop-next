import { createUrl } from '../url/create-url';
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
    return createUrl({
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
    return createUrl({
        searchParams,
        params: {
            page,
            view: PAGINATION_VIEWS.APPEND,
            from,
        },
    });
}

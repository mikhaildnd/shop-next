import { appendPaginationSearchParams } from '@/lib/pagination/append-pagination-search-params';
import { PAGINATION_VIEWS } from '@/lib/pagination/consts';
import type { SearchParams } from '@/lib/url/types';

import { buildSearchParams } from '../url/build-search-params';

type CreatePaginationUrlParams = {
    pathname: string;
    searchParams: SearchParams;
    page: number;
};

type CreateLoadMoreUrlParams = {
    pathname: string;
    searchParams: SearchParams;
    page: number;
    from: number;
};

export function createPaginationUrl({
    pathname,
    searchParams,
    page,
}: CreatePaginationUrlParams) {
    const params = new URLSearchParams(searchParams);

    appendPaginationSearchParams({
        params,
        pagination: {
            currentPage: page,
            startPage: page,
            view: PAGINATION_VIEWS.SINGLE,
        },
    });

    return `${pathname}${buildSearchParams(params)}`;
}

export function createLoadMoreUrl({
    pathname,
    searchParams,
    page,
    from,
}: CreateLoadMoreUrlParams) {
    const params = new URLSearchParams(searchParams);

    appendPaginationSearchParams({
        params,
        pagination: {
            currentPage: page,
            startPage: from,
            view: PAGINATION_VIEWS.APPEND,
        },
    });

    return `${pathname}${buildSearchParams(params)}`;
}

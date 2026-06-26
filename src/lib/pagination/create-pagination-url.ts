import { buildSearchParams } from '../url/build-search-params';
import type { SearchParams } from '@/lib/url/types';
import { PAGINATION_VIEWS } from '@/lib/pagination/consts';

// TODO refactor

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
    const query = buildSearchParams({
        searchParams,
        params: {
            page,
            view: undefined,
            from: undefined,
        },
    });

    return `${pathname}${query}`;
}

export function createLoadMoreUrl({
    pathname,
    searchParams,
    page,
    from,
}: CreateLoadMoreUrlParams) {
    const query = buildSearchParams({
        searchParams,
        params: {
            page,
            view: PAGINATION_VIEWS.APPEND,
            from,
        },
    });

    return `${pathname}${query}`;
}

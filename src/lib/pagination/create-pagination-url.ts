import { updateSearchParams } from '../url/update-search-params';
import type { SearchParams } from '@/lib/url/types';
import { PAGINATION_VIEWS } from '@/lib/pagination/consts';

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
    const query = updateSearchParams({
        searchParams,
        params: {
            page: page > 1 ? page : undefined,
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
    const query = updateSearchParams({
        searchParams,
        params: {
            page,
            view: PAGINATION_VIEWS.APPEND,
            from,
        },
    });

    return `${pathname}${query}`;
}

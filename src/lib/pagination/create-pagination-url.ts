import { createUrl } from '../url/create-url';
import type { SearchParams } from '@/lib/url/types';

interface CreatePaginationUrlParams {
    searchParams: SearchParams;
    page: number;
}

interface CreateLoadMoreUrlParams {
    searchParams: SearchParams;
    page: number;
    from: number;
}

export function createPaginationUrl({
    searchParams,
    page,
}: CreatePaginationUrlParams) {
    return createUrl({
        searchParams,
        params: {
            page,
            view: 'single',
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
            view: 'append',
            from,
        },
    });
}

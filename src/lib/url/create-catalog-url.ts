import { createUrl } from './create-url';
import type { SearchParams } from '@/lib/url/types';

type CreateCatalogPageUrlParams = {
    searchParams: SearchParams;
    page: number;
};

type CreateLoadMoreUrlParams = {
    searchParams: SearchParams;
    page: number;
    from: number;
};

export function createCatalogPageUrl({
    searchParams,
    page,
}: CreateCatalogPageUrlParams) {
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

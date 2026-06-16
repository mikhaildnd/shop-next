import type { PaginationSearchParams } from '@/lib/pagination/types';
import { PAGINATION_VIEWS } from '@/lib/pagination/consts';
import { normalizePageNumber } from '@/lib/pagination/normalize/normalize-page-number';
import { normalizeViewParam } from '@/lib/pagination/normalize/normalize-view-param';

type GetPaginationParamsOptions = {
    searchParams: PaginationSearchParams;
    limit: number;
};

export function getPaginationParams({
    searchParams,
    limit,
}: GetPaginationParamsOptions) {
    const currentPage = normalizePageNumber(searchParams.page);

    const view = normalizeViewParam(searchParams.view);

    const isAppendMode = view === PAGINATION_VIEWS.APPEND;

    const startPage = isAppendMode
        ? normalizePageNumber(searchParams.from)
        : currentPage;

    const normalizedStartPage = Math.min(startPage, currentPage);

    const pagesToLoad = currentPage - normalizedStartPage + 1;
    const take = pagesToLoad * limit;
    const skip = (normalizedStartPage - 1) * limit;

    return {
        currentPage,
        startPage: normalizedStartPage,
        take,
        skip,
    };
}

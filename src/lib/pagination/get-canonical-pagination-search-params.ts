import type { PaginationSearchParams } from '@/lib/pagination/types';
import { normalizePageNumber } from '@/lib/pagination/search-params/normalize-page-number';
import { normalizeViewParam } from '@/lib/pagination/search-params/normalize-view-param';
import { PAGINATION_VIEWS } from '@/lib/pagination/consts';

export function getCanonicalPaginationSearchParams(
    searchParams: PaginationSearchParams,
): PaginationSearchParams {
    const page = normalizePageNumber(searchParams.page);
    const view = normalizeViewParam(searchParams.view);

    const result: PaginationSearchParams = {};

    if (page > 1) {
        result.page = String(page);

        if (view === PAGINATION_VIEWS.APPEND) {
            const from = normalizePageNumber(searchParams.from);

            if (from < page) {
                result.view = PAGINATION_VIEWS.APPEND;
                result.from = String(from);
            }
        }
    }

    return result;
}

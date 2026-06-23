// мб удалить, сейчас не используется

import { updateSearchParams } from '@/lib/url/update-search-params';
import type { PaginationSearchParams } from '@/lib/pagination/types';
import { getCanonicalPaginationSearchParams } from '@/lib/pagination/get-canonical-pagination-search-params';

export function getCanonicalPaginationUrl(
    searchParams: PaginationSearchParams,
): string {
    const canonical = getCanonicalPaginationSearchParams(searchParams);

    return updateSearchParams({
        searchParams: new URLSearchParams(),
        params: canonical,
    });
}

import { createUrl } from '@/lib/url/create-url';
import type { PaginationSearchParams } from '@/lib/pagination/types';
import { getCanonicalPaginationSearchParams } from '@/lib/pagination/get-canonical-pagination-search-params';

export function getCanonicalPaginationUrl(
    searchParams: PaginationSearchParams,
): string {
    const canonical = getCanonicalPaginationSearchParams(searchParams);

    return createUrl({
        searchParams: new URLSearchParams(),
        params: canonical,
    });
}

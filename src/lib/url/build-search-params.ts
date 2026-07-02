import type { SearchParams } from '@/lib/url/types';

export function buildSearchParams(
    searchParams: SearchParams = new URLSearchParams(),
) {
    const nextParams = new URLSearchParams(searchParams.toString());

    nextParams.sort();

    const query = nextParams.toString();

    return query ? `?${query}` : '';
}

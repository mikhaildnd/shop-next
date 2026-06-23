import type { SearchResponse } from '@/lib/api/search.types';
import { routes } from '@/lib/routes';

export async function fetchSearch(
    query: string,
    signal?: AbortSignal,
): Promise<SearchResponse> {
    const response = await fetch(routes.api.search(query), {
        signal,
    });

    if (!response.ok) {
        throw new Error('Search failed');
    }

    return response.json();
}

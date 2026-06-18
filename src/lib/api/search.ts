import type { SearchResponse } from '@/services/search/types';

export async function searchProducts(
    query: string,
    signal?: AbortSignal,
): Promise<SearchResponse> {
    const params = new URLSearchParams({
        q: query,
    });

    const response = await fetch(`/api/search?${params}`, {
        signal,
    });

    if (!response.ok) {
        throw new Error('Search failed');
    }

    return response.json();
}

import { MIN_SEARCH_QUERY_LENGTH } from '@/lib/search/consts';

export type SearchQueryState =
    | { status: 'empty' }
    | { status: 'too-short' }
    | { status: 'success'; query: string };

export function normalizeSearchQuery(value?: string): SearchQueryState {
    const query = value?.trim() ?? '';

    if (!query) {
        return {
            status: 'empty',
        };
    }

    if (query.length < MIN_SEARCH_QUERY_LENGTH) {
        return {
            status: 'too-short',
        };
    }

    return {
        status: 'success',
        query,
    };
}

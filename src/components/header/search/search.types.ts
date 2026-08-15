import type { SearchResponse } from '@/lib/api/search.types';

export type SearchState = {
    query: string;
    results: SearchResponse | null;
    searchUrl: string;
    updateQuery: (value: string) => void;
    searchCurrentQuery: () => void;
    submitSearch: () => boolean;
    resetSearch: () => void;
};

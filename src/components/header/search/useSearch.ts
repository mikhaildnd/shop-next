'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { fetchSearch } from '@/lib/api/search';
import type { SearchResponse } from '@/lib/api/search.types';
import { routes } from '@/lib/routes';
import {
    MIN_SEARCH_QUERY_LENGTH,
    SEARCH_QUERY_PARAM,
} from '@/lib/search/consts';

export type SearchState = {
    query: string;
    results: SearchResponse | null;
    searchUrl: string;
    updateQuery: (value: string) => void;
    searchCurrentQuery: () => void;
    submitSearch: () => boolean;
    resetSearch: () => void;
};

export function useSearch(): SearchState {
    const router = useRouter();
    const searchParams = useSearchParams();

    const abortControllerRef = useRef<AbortController | null>(null);
    const lastSearchQueryRef = useRef('');

    const urlQuery = searchParams.get(SEARCH_QUERY_PARAM) ?? '';

    const [query, setQuery] = useState(urlQuery);
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(
        null,
    );

    const trimmedQuery = query.trim();
    const searchUrl = routes.searchPage(trimmedQuery);

    // Synchronize the local search state with URL changes.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuery(urlQuery);
    }, [urlQuery]);

    async function search(query: string) {
        if (query.length < MIN_SEARCH_QUERY_LENGTH) {
            setSearchResults(null);

            return;
        }

        abortControllerRef.current?.abort();

        const controller = new AbortController();

        abortControllerRef.current = controller;

        try {
            const data = await fetchSearch(query, controller.signal);

            if (controller.signal.aborted) {
                return;
            }

            setSearchResults(data);

            lastSearchQueryRef.current = query;
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error(error);
            }
        }
    }

    const debouncedSearch = useDebouncedCallback(search, 300);

    function updateQuery(value: string) {
        const trimmedValue = value.trim();

        setQuery(value);

        if (trimmedValue.length < MIN_SEARCH_QUERY_LENGTH) {
            debouncedSearch.cancel();
            abortControllerRef.current?.abort();

            setSearchResults(null);

            return;
        }

        debouncedSearch(trimmedValue);
    }

    function searchCurrentQuery() {
        if (trimmedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
            return;
        }

        if (lastSearchQueryRef.current === trimmedQuery) {
            return;
        }

        debouncedSearch.cancel();

        void search(trimmedQuery);
    }

    const submitSearch = () => {
        if (trimmedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
            return false;
        }

        if (trimmedQuery === urlQuery) {
            return false;
        }

        debouncedSearch.cancel();

        abortControllerRef.current?.abort();

        router.push(searchUrl);

        return true;
    };

    function resetSearch() {
        abortControllerRef.current?.abort();
        debouncedSearch.cancel();

        setQuery('');
        setSearchResults(null);
        lastSearchQueryRef.current = '';
    }

    return {
        query,
        results: searchResults,
        searchUrl,

        updateQuery,
        searchCurrentQuery,
        submitSearch,
        resetSearch,
    };
}

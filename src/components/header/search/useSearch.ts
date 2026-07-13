'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { SubmitEventHandler} from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { fetchSearch } from '@/lib/api/search';
import type { SearchResponse } from '@/lib/api/search.types';
import { routes } from '@/lib/routes';
import {
    MIN_SEARCH_QUERY_LENGTH,
    SEARCH_QUERY_PARAM,
} from '@/lib/search/consts';

export function useSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const abortControllerRef = useRef<AbortController | null>(null);
    const lastSearchQueryRef = useRef('');

    const urlQuery = searchParams.get(SEARCH_QUERY_PARAM) ?? '';

    const [query, setQuery] = useState(urlQuery);
    const [results, setResults] = useState<SearchResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const trimmedQuery = query.trim();
    const searchUrl = routes.searchPage(trimmedQuery);

    // Synchronize the input with URL changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuery(urlQuery);
    }, [urlQuery]);

    async function search(query: string) {
        if (query.length < MIN_SEARCH_QUERY_LENGTH) {
            setResults(null);

            return;
        }

        abortControllerRef.current?.abort();

        const controller = new AbortController();

        abortControllerRef.current = controller;

        setIsLoading(true);

        try {
            const data = await fetchSearch(query, controller.signal);

            if (controller.signal.aborted) {
                return;
            }

            setResults(data);
            lastSearchQueryRef.current = query;
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error(error);
            }
        } finally {
            if (abortControllerRef.current === controller) {
                setIsLoading(false);
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

            setResults(null);

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

    const submitSearch: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (trimmedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
            return;
        }

        if (trimmedQuery === urlQuery) {
            return;
        }

        debouncedSearch.cancel();

        abortControllerRef.current?.abort();

        router.push(searchUrl);
    };

    function resetSearch() {
        abortControllerRef.current?.abort();
        debouncedSearch.cancel();

        setQuery('');
        setResults(null);
        lastSearchQueryRef.current = '';
    }

    return {
        query,
        results,
        isLoading,
        searchUrl,

        updateQuery,
        searchCurrentQuery,
        submitSearch,
        resetSearch,
    };
}

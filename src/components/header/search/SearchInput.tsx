'use client';

import SearchDropdown from '@/components/header/search/SearchDropdown';
import { X as IconClose, Search as IconSearch } from 'lucide-react';
import {
    type ChangeEvent,
    type SubmitEventHandler,
    useRef,
    useState,
} from 'react';
import {
    MIN_SEARCH_QUERY_LENGTH,
    SEARCH_QUERY_PARAM,
} from '@/lib/search/consts';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDismiss } from '@/hooks/useDismiss';
import { routes } from '@/lib/routes';
import type { SearchResponse } from '@/lib/api/search.types';
import { fetchSearch } from '@/lib/api/search';
import { useDebouncedCallback } from 'use-debounce';

const SearchInput = () => {
    const iconButtonClass =
        'rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 cursor-pointer';

    const router = useRouter();
    const searchParams = useSearchParams();

    const containerRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const urlQuery = searchParams.get(SEARCH_QUERY_PARAM) ?? '';

    const [query, setQuery] = useState(urlQuery);
    const trimmedQuery = query.trim();
    const searchUrl = routes.search(trimmedQuery);

    const [results, setResults] = useState<SearchResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const lastSearchQueryRef = useRef('');

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

    const openDropdown = () => {
        setIsOpen(true);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    useDismiss({
        ref: containerRef,
        onClickOutside: closeDropdown,
        onEscape: closeDropdown,
    });

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        closeDropdown();

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

    const handleFocus = () => {
        if (trimmedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
            return;
        }

        openDropdown();

        if (lastSearchQueryRef.current === trimmedQuery) {
            return;
        }

        debouncedSearch.cancel();

        void search(trimmedQuery);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const trimmedValue = value.trim();

        setQuery(value);

        if (trimmedValue.length < MIN_SEARCH_QUERY_LENGTH) {
            setResults(null);
            closeDropdown();

            return;
        }

        openDropdown();
        debouncedSearch(trimmedValue);
    };

    const resetSearch = () => {
        abortControllerRef.current?.abort();
        debouncedSearch.cancel();

        lastSearchQueryRef.current = '';

        setQuery('');
        setResults(null);
        closeDropdown();
    };

    return (
        <div
            ref={containerRef}
            className="relative grow"
        >
            <form
                onSubmit={handleSubmit}
                autoComplete="off"
            >
                <input
                    autoComplete="off"
                    value={query}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    type="text"
                    placeholder="Найти товар"
                    className="h-10 w-full rounded bg-gray-50 p-2 pr-16 text-base leading-[150%] text-black outline outline-(--color-primary) placeholder:text-(--placeholder-text-color) focus:bg-white focus:shadow-(--shadow-button-default)"
                />

                <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-2">
                    {isLoading && (
                        <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-(--color-primary)" />
                    )}
                    {query && (
                        <button
                            type="button"
                            onClick={resetSearch}
                            aria-label="Очистить поиск"
                            className={iconButtonClass}
                        >
                            <IconClose className="size-5 text-gray-500 transition-colors" />
                        </button>
                    )}

                    <button
                        type="submit"
                        aria-label="Поиск"
                        className={iconButtonClass}
                    >
                        <IconSearch className="size-5 text-gray-500" />
                    </button>
                </div>
            </form>

            {isOpen && (
                <SearchDropdown
                    results={results}
                    onClose={closeDropdown}
                    allResultsUrl={searchUrl}
                />
            )}
        </div>
    );
};

export default SearchInput;

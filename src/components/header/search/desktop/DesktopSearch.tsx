'use client';

import type { ChangeEvent, SubmitEventHandler } from 'react';
import { useRef, useState } from 'react';

import { SearchForm } from '@/components/header/search/form/SearchForm';
import { useSearchContext } from '@/components/header/search/SearchContext';
import { SearchResults } from '@/components/header/search/SearchResults';
import { useDismiss } from '@/hooks/useDismiss';
import { MIN_SEARCH_QUERY_LENGTH } from '@/lib/search/consts';

export function DesktopSearch() {
    const {
        query,
        results,
        isLoading,
        searchUrl,
        updateQuery,
        searchCurrentQuery,
        submitSearch,
        resetSearch,
    } = useSearchContext();

    const containerRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(false);

    const openDropdown = () => setIsOpen(true);
    const closeDropdown = () => setIsOpen(false);

    useDismiss({
        ref: containerRef,
        onClickOutside: closeDropdown,
        onEscape: closeDropdown,
    });

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        updateQuery(e.target.value);

        if (e.target.value.trim().length >= MIN_SEARCH_QUERY_LENGTH) {
            openDropdown();
        }
    }

    function handleFocus() {
        if (query.trim().length < MIN_SEARCH_QUERY_LENGTH) {
            return;
        }

        openDropdown();
        searchCurrentQuery();
    }

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        closeDropdown();
        submitSearch(e);
    };

    return (
        <div
            ref={containerRef}
            className="relative hidden grow md:block"
        >
            <SearchForm
                value={query}
                isLoading={isLoading}
                onChange={handleChange}
                onFocus={handleFocus}
                onSubmit={handleSubmit}
                onReset={resetSearch}
            />

            {isOpen && results && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border border-(--color-primary) bg-white shadow-lg">
                    <SearchResults
                        className="max-h-[500px]"
                        results={results}
                        allResultsUrl={searchUrl}
                        onClose={closeDropdown}
                    />
                </div>
            )}
        </div>
    );
}

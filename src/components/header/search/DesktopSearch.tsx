'use client';

import type { ChangeEvent, SubmitEventHandler } from 'react';
import { useRef, useState } from 'react';

import { useSearchContext } from '@/components/header/search/SearchContext';
import { SearchForm } from '@/components/header/search/SearchForm';
import { SearchHistory } from '@/components/header/search/SearchHistory';
import { SearchResults } from '@/components/header/search/SearchResults';
import { useDismiss } from '@/hooks/useDismiss';
import { MIN_SEARCH_QUERY_LENGTH } from '@/lib/search/consts';
import { createQueryHistoryItem } from '@/lib/search/search-history-items';

export function DesktopSearch() {
    const {
        query,
        results,
        searchUrl,
        updateQuery,
        searchCurrentQuery,
        submitSearch,
        resetSearch,
        history,
    } = useSearchContext();

    const containerRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(false);

    const trimmedQuery = query.trim();
    const hasValidQuery = trimmedQuery.length >= MIN_SEARCH_QUERY_LENGTH;
    const hasHistory = history.items.length > 0;

    const hasResults = results !== null;

    const shouldShowHistory = trimmedQuery === '' && hasHistory;

    const shouldShowResults = hasValidQuery && hasResults;

    const shouldShowPanel = isOpen && (shouldShowHistory || shouldShowResults);

    const openSearchPanel = () => setIsOpen(true);
    const closeSearchPanel = () => setIsOpen(false);

    useDismiss({
        ref: containerRef,
        onClickOutside: closeSearchPanel,
        onEscape: closeSearchPanel,
    });

    const handleResultSelect = () => {
        resetSearch();
        closeSearchPanel();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        updateQuery(e.target.value);

        openSearchPanel();
    };

    const handleFocus = () => {
        openSearchPanel();

        if (hasValidQuery) {
            searchCurrentQuery();
        }
    };

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!submitSearch()) {
            return;
        }

        history.save(createQueryHistoryItem(trimmedQuery));

        closeSearchPanel();
    };

    return (
        <div
            ref={containerRef}
            className="relative hidden grow md:block"
        >
            <SearchForm
                value={query}
                onChange={handleChange}
                onFocus={handleFocus}
                onSubmit={handleSubmit}
                onReset={resetSearch}
            />

            {shouldShowPanel && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border border-(--color-primary) bg-white shadow-lg">
                    {shouldShowHistory && (
                        <SearchHistory
                            onSelect={closeSearchPanel}
                            history={history}
                        />
                    )}

                    {shouldShowResults && (
                        <SearchResults
                            className="max-h-[500px]"
                            results={results}
                            allResultsUrl={searchUrl}
                            onResultSelect={handleResultSelect}
                            onShowAll={closeSearchPanel}
                            history={history}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

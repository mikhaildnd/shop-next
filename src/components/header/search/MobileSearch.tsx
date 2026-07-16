'use client';

import { Search as IconSearch } from 'lucide-react';
import type { ChangeEvent, SubmitEventHandler } from 'react';
import { useState } from 'react';

import { useSearchContext } from '@/components/header/search/SearchContext';
import { SearchForm } from '@/components/header/search/SearchForm';
import { SearchHistory } from '@/components/header/search/SearchHistory';
import { SearchResults } from '@/components/header/search/SearchResults';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { MIN_SEARCH_QUERY_LENGTH } from '@/lib/search/consts';
import { createQueryHistoryItem } from '@/lib/search/search-history-items';

export function MobileSearch() {
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

    const [isOpen, setIsOpen] = useState(false);

    useLockBodyScroll(isOpen);

    const trimmedQuery = query.trim();
    const hasValidQuery = trimmedQuery.length >= MIN_SEARCH_QUERY_LENGTH;
    const hasHistory = history.items.length > 0;

    const hasResults = results !== null;

    const shouldShowHistory = trimmedQuery === '' && hasHistory;

    const shouldShowResults = hasValidQuery && hasResults;

    const shouldShowPanel = shouldShowHistory || shouldShowResults;

    const openSearchPanel = () => setIsOpen(true);
    const closeSearchPanel = () => setIsOpen(false);

    const handleResultSelect = () => {
        resetSearch();
        closeSearchPanel();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        updateQuery(e.target.value);
    };

    const handleFocus = () => {
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
        <>
            <button
                onClick={openSearchPanel}
                type="button"
                aria-label="Поиск"
                className="ml-auto p-2 md:hidden"
            >
                <IconSearch className="size-7 text-gray-500" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-white md:hidden">
                    <div className="flex gap-1 px-3 py-4">
                        <SearchForm
                            value={query}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onSubmit={handleSubmit}
                            onReset={resetSearch}
                        />

                        <button
                            type="button"
                            onClick={closeSearchPanel}
                            aria-label="Закрыть поиск"
                            className="px-1 text-sm text-(--color-primary)"
                        >
                            Отмена
                        </button>
                    </div>

                    {shouldShowPanel && (
                        <>
                            {shouldShowHistory && (
                                <SearchHistory
                                    onSelect={closeSearchPanel}
                                    history={history}
                                />
                            )}

                            {shouldShowResults && (
                                <SearchResults
                                    className="grow"
                                    results={results}
                                    allResultsUrl={searchUrl}
                                    onResultSelect={handleResultSelect}
                                    onShowAll={closeSearchPanel}
                                    history={history}
                                />
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
}

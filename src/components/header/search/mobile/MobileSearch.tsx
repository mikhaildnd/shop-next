'use client';

import { Search as IconSearch } from 'lucide-react';
import type { ChangeEvent, SubmitEventHandler } from 'react';
import { useState } from 'react';

import { SearchForm } from '@/components/header/search/form/SearchForm';
import { useSearchContext } from '@/components/header/search/SearchContext';
import { SearchResults } from '@/components/header/search/SearchResults';
import { MIN_SEARCH_QUERY_LENGTH } from '@/lib/search/consts';

export function MobileSearch() {
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

    const [isOpen, setIsOpen] = useState(false);

    const openDropdown = () => setIsOpen(true);
    const closeDropdown = () => setIsOpen(false);

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

        searchCurrentQuery();
    }

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        closeDropdown();
        submitSearch(e);
    };

    return (
        <>
            <button
                onClick={openDropdown}
                type="button"
                aria-label="Поиск"
                className="ml-auto p-2 md:hidden"
            >
                <IconSearch className="size-7 text-gray-500" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-white">
                    <div className="flex gap-1 px-3 py-4">
                        <SearchForm
                            value={query}
                            isLoading={isLoading}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onSubmit={handleSubmit}
                            onReset={resetSearch}
                        />

                        <button
                            type="button"
                            onClick={closeDropdown}
                            aria-label="Закрыть поиск"
                            className="px-1 text-sm text-(--color-primary)"
                        >
                            Отмена
                        </button>
                    </div>

                    {results && (
                        <SearchResults
                            className="grow"
                            results={results}
                            allResultsUrl={searchUrl}
                            onClose={closeDropdown}
                        />
                    )}
                </div>
            )}
        </>
    );
}

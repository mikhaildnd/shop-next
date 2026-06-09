'use client';

import { type SubmitEventHandler, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchDropdown from '@/components/header/search/SearchDropdown';
import { useDebounce } from '@/hooks/useDebounce';
import { searchProducts } from '@/lib/api/search';
import type { SearchResponse } from '@/services/search/types';
import { useDropdownDismiss } from '@/hooks/useDropdownDissmiss';
import { routes } from '@/lib/routes';
import { X as IconClose, Search as IconSearch } from 'lucide-react';

const SearchInput = () => {
    const router = useRouter();

    const containerRef = useRef<HTMLDivElement>(null);

    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<SearchResponse | null>(null);

    const debouncedQuery = useDebounce(query, 300);
    const searchQuery = query.trim();

    const searchUrl = routes.search(searchQuery);

    const closeDropdown = () => {
        setIsOpen(false);
    };

    const resetDropdown = () => {
        setQuery('');
        setResults(null);
        setIsOpen(false);
    };

    useDropdownDismiss({
        ref: containerRef,
        onClickOutside: closeDropdown,
        onEscape: resetDropdown,
    });

    useEffect(() => {
        const debouncedSearchQuery = debouncedQuery.trim();

        const controller = new AbortController();

        if (debouncedSearchQuery.length < 2) {
            setResults(null);
            setIsOpen(false);
            setIsLoading(false);

            return () => controller.abort();
        }

        setIsLoading(true);

        searchProducts(debouncedSearchQuery, controller.signal)
            .then((data) => {
                setResults(data);
                setIsOpen(true);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error(error);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [debouncedQuery]);

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (searchQuery.length < 2) {
            return;
        }

        closeDropdown();

        router.push(searchUrl);
    };

    const iconButtonClass =
        'rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 cursor-pointer';

    return (
        <div
            ref={containerRef}
            className="relative grow"
        >
            <form onSubmit={handleSubmit}>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (results) {
                            setIsOpen(true);
                        }
                    }}
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
                            onClick={resetDropdown}
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

            {isOpen && results && (
                <SearchDropdown
                    onClose={closeDropdown}
                    products={results.products}
                    categories={results.categories}
                    productsCount={results.productsCount}
                    allResultsUrl={searchUrl}
                />
            )}
        </div>
    );
};

export default SearchInput;

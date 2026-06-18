'use client';

import SearchDropdown from '@/components/header/search/SearchDropdown';
import { X as IconClose, Search as IconSearch } from 'lucide-react';
import { useSearchInput } from '@/hooks/useSearchInput';

const SearchInput = () => {
    const {
        containerRef,
        query,
        isOpen,
        isLoading,
        results,
        searchUrl,
        setQuery,
        setIsOpen,
        resetSearch,
        handleSubmit,
    } = useSearchInput();

    const iconButtonClass =
        'rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 cursor-pointer';

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

            {isOpen && results && (
                <SearchDropdown
                    onClose={() => setIsOpen(false)}
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

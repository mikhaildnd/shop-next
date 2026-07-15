import { SearchHistoryItem } from '@/components/header/search/SearchHistoryItem';
import { getSearchHistoryItemKey } from '@/lib/search/search-history';
import type { SearchHistoryState } from '@/lib/search/search-history.types';

interface SearchHistoryProps {
    history: SearchHistoryState;
    onSelect: () => void;
}

export function SearchHistory({ history, onSelect }: SearchHistoryProps) {
    return (
        <section aria-labelledby="search-history-heading">
            <div className="flex items-center justify-between px-3 py-4">
                <h3
                    id="search-history-heading"
                    className="text-md text-gray-500"
                >
                    История поиска
                </h3>
                <button
                    type="button"
                    onClick={history.clearHistory}
                    aria-label="Очистить историю"
                    className="rounded px-1 py-0.5 text-sm text-gray-500 transition-colors hover:text-(--color-primary) focus-visible:text-(--color-primary) focus-visible:ring-1 focus-visible:ring-(--color-primary) focus-visible:outline-none md:cursor-pointer"
                >
                    Очистить историю
                </button>
            </div>
            <ul className="md:pb-3">
                {history.items.map((item) => (
                    <SearchHistoryItem
                        key={getSearchHistoryItemKey(item)}
                        item={item}
                        onRemove={history.remove}
                        onSelect={onSelect}
                    />
                ))}
            </ul>
        </section>
    );
}

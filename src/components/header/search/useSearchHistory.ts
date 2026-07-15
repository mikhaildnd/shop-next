import { useState } from 'react';

import {
    clearSearchHistory,
    getSearchHistory,
    removeSearchHistoryItem,
    saveSearchHistoryItem,
} from '@/lib/search/search-history';
import type {
    SearchHistoryItem,
    SearchHistoryState,
} from '@/lib/search/search-history.types';

export function useSearchHistory(): SearchHistoryState {
    const [history, setHistory] = useState<SearchHistoryItem[]>(() =>
        getSearchHistory(),
    );

    function save(item: SearchHistoryItem) {
        setHistory(saveSearchHistoryItem(item));
    }

    function remove(item: SearchHistoryItem) {
        setHistory(removeSearchHistoryItem(item));
    }

    function clearHistory() {
        clearSearchHistory();
        setHistory([]);
    }

    return {
        items: history,
        save,
        remove,
        clearHistory,
    };
}

import { routes } from '@/lib/routes';
import {
    MAX_SEARCH_HISTORY_ITEMS,
    SEARCH_HISTORY_KEY,
} from '@/lib/search/consts';
import type { SearchHistoryItem } from '@/lib/search/search-history.types';

function parseSearchHistory(value: string | null): SearchHistoryItem[] {
    if (!value) {
        return [];
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
}

export function getSearchHistoryItemTitle(item: SearchHistoryItem) {
    return item.type === 'query' ? item.query : item.title;
}

export function getSearchHistoryItemHref(item: SearchHistoryItem) {
    switch (item.type) {
        case 'query':
            return routes.searchPage(item.query);

        case 'category':
            return routes.categoryPage(item.slug);

        case 'product':
            return routes.productPage(item.slug);
    }
}

export function getSearchHistoryItemKey(item: SearchHistoryItem) {
    switch (item.type) {
        case 'query':
            return `query:${item.query}`;

        case 'category':
            return `category:${item.slug}`;

        case 'product':
            return `product:${item.slug}`;
    }
}

function isSameSearchHistoryItem(a: SearchHistoryItem, b: SearchHistoryItem) {
    return getSearchHistoryItemKey(a) === getSearchHistoryItemKey(b);
}

export function getSearchHistory(): SearchHistoryItem[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const history = localStorage.getItem(SEARCH_HISTORY_KEY);

        return parseSearchHistory(history);
    } catch {
        return [];
    }
}

export function saveSearchHistoryItem(
    item: SearchHistoryItem,
): SearchHistoryItem[] {
    const history = getSearchHistory();

    const nextHistory = [
        item,
        ...history.filter(
            (historyItem) => !isSameSearchHistoryItem(historyItem, item),
        ),
    ].slice(0, MAX_SEARCH_HISTORY_ITEMS);

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextHistory));

    return nextHistory;
}

export function removeSearchHistoryItem(
    item: SearchHistoryItem,
): SearchHistoryItem[] {
    const nextHistory = getSearchHistory().filter(
        (historyItem) => !isSameSearchHistoryItem(historyItem, item),
    );

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextHistory));

    return nextHistory;
}

export function clearSearchHistory() {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
}

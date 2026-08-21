import {
    FAVORITES_STORAGE_KEY,
    SERVER_FAVORITE_IDS,
} from '@/lib/favorite/favorite-storage.constants';

type FavoriteListener = () => void;

const listeners = new Set<FavoriteListener>();

function parseFavoriteIds(value: string | null): string[] {
    if (!value) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);

        return Array.isArray(parsed) &&
            parsed.every((id) => typeof id === 'string')
            ? parsed
            : [];
    } catch {
        return [];
    }
}

function readFavoriteIds(): string[] {
    if (typeof window === 'undefined') {
        return SERVER_FAVORITE_IDS;
    }

    return parseFavoriteIds(localStorage.getItem(FAVORITES_STORAGE_KEY));
}

let favoriteIdsSnapshot = readFavoriteIds();

export function getFavoriteIds(): string[] {
    return favoriteIdsSnapshot;
}

export function getServerFavoriteIds(): string[] {
    return SERVER_FAVORITE_IDS;
}

export function subscribeToFavorites(listener: FavoriteListener): () => void {
    listeners.add(listener);

    function handleStorageChange(event: StorageEvent) {
        if (event.key !== FAVORITES_STORAGE_KEY) {
            return;
        }

        favoriteIdsSnapshot = readFavoriteIds();
        listener();
    }

    window.addEventListener('storage', handleStorageChange);

    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', handleStorageChange);
    };
}

function notifyListeners(): void {
    favoriteIdsSnapshot = readFavoriteIds();

    listeners.forEach((listener) => {
        listener();
    });
}

export function addFavorite(productId: string): string[] {
    const favoriteIds = getFavoriteIds();

    if (favoriteIds.includes(productId)) {
        return favoriteIds;
    }

    const nextFavoriteIds = [...favoriteIds, productId];

    localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(nextFavoriteIds),
    );

    notifyListeners();

    return nextFavoriteIds;
}

export function removeFavorite(productId: string): string[] {
    const favoriteIds = getFavoriteIds();

    if (!favoriteIds.includes(productId)) {
        return favoriteIds;
    }

    const nextFavoriteIds = getFavoriteIds().filter((id) => id !== productId);

    localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(nextFavoriteIds),
    );

    notifyListeners();

    return nextFavoriteIds;
}

export function clearFavorites(): void {
    if (getFavoriteIds().length === 0) {
        return;
    }

    localStorage.removeItem(FAVORITES_STORAGE_KEY);

    notifyListeners();
}

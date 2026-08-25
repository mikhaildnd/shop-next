import { FAVORITES_STORAGE_KEY } from '@/lib/favorite/favorite-storage.constants';

type FavoriteListener = () => void;

const listeners = new Set<FavoriteListener>();

function isFavoriteId(value: unknown): value is string {
    return typeof value === 'string';
}

function parseFavoriteIds(value: string | null): string[] {
    if (!value) {
        return [];
    }

    try {
        const parsed: unknown = JSON.parse(value);

        return Array.isArray(parsed) && parsed.every(isFavoriteId)
            ? parsed
            : [];
    } catch {
        return [];
    }
}

function readFavoriteIds(): string[] {
    if (typeof window === 'undefined') {
        return [];
    }

    return parseFavoriteIds(localStorage.getItem(FAVORITES_STORAGE_KEY));
}

let favoriteIdsSnapshot = readFavoriteIds();

export function getFavoriteIds(): string[] {
    return favoriteIdsSnapshot;
}

const EMPTY_FAVORITE_IDS: string[] = [];

export function getServerFavoriteIds(): string[] {
    return EMPTY_FAVORITE_IDS;
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

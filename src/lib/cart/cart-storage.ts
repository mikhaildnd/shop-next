import type { CartEntry } from '@/lib/cart/cart.types';
import { CART_STORAGE_KEY } from '@/lib/cart/cart-storage.constants';

type CartListener = () => void;

const listeners = new Set<CartListener>();

function isCartEntry(value: unknown): value is CartEntry {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const entry = value as Record<string, unknown>;

    return (
        typeof entry.productId === 'string' &&
        typeof entry.quantity === 'number' &&
        Number.isInteger(entry.quantity) &&
        entry.quantity > 0
    );
}

function parseCartEntries(value: string | null): CartEntry[] {
    if (!value) {
        return [];
    }

    try {
        const parsed: unknown = JSON.parse(value);

        return Array.isArray(parsed) ? parsed.filter(isCartEntry) : [];
    } catch {
        return [];
    }
}

function readCartEntries(): CartEntry[] {
    if (typeof window === 'undefined') {
        return [];
    }

    return parseCartEntries(localStorage.getItem(CART_STORAGE_KEY));
}

let cartEntriesSnapshot = readCartEntries();

export function getCartEntries(): CartEntry[] {
    return cartEntriesSnapshot;
}

const EMPTY_CART_ENTRIES: CartEntry[] = [];

export function getServerCartEntries(): CartEntry[] {
    return EMPTY_CART_ENTRIES;
}

export function subscribeToCart(listener: CartListener): () => void {
    listeners.add(listener);

    function handleStorageChange(event: StorageEvent) {
        if (event.key !== CART_STORAGE_KEY) {
            return;
        }

        cartEntriesSnapshot = readCartEntries();
        listener();
    }

    window.addEventListener('storage', handleStorageChange);

    return () => {
        listeners.delete(listener);

        window.removeEventListener('storage', handleStorageChange);
    };
}

function notifyListeners(): void {
    cartEntriesSnapshot = readCartEntries();

    listeners.forEach((listener) => {
        listener();
    });
}

export function addCartEntry(productId: string): CartEntry[] {
    const cartEntries = getCartEntries();

    const existingEntry = cartEntries.find(
        (entry) => entry.productId === productId,
    );

    if (existingEntry) {
        return cartEntries;
    }

    const nextCartEntries = [
        {
            productId,
            quantity: 1,
        },
        ...cartEntries,
    ];

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCartEntries));

    notifyListeners();

    return nextCartEntries;
}

export function removeCartEntry(productId: string): CartEntry[] {
    const cartEntries = getCartEntries();

    const nextCartEntries = cartEntries.filter(
        (entry) => entry.productId !== productId,
    );

    if (nextCartEntries.length === cartEntries.length) {
        return cartEntries;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCartEntries));

    notifyListeners();

    return nextCartEntries;
}

export function incrementCartEntry(productId: string): CartEntry[] {
    const cartEntries = getCartEntries();

    const existingEntry = cartEntries.find(
        (entry) => entry.productId === productId,
    );

    if (!existingEntry) {
        return cartEntries;
    }

    const nextCartEntries = cartEntries.map((entry) => {
        if (entry.productId !== productId) {
            return entry;
        }

        return {
            ...entry,
            quantity: entry.quantity + 1,
        };
    });

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCartEntries));

    notifyListeners();

    return nextCartEntries;
}

export function decrementCartEntry(productId: string): CartEntry[] {
    const cartEntries = getCartEntries();

    const existingEntry = cartEntries.find(
        (entry) => entry.productId === productId,
    );

    if (!existingEntry) {
        return cartEntries;
    }

    if (existingEntry.quantity === 1) {
        return removeCartEntry(productId);
    }

    const nextCartEntries = cartEntries.map((entry) => {
        if (entry.productId !== productId) {
            return entry;
        }

        return {
            ...entry,
            quantity: entry.quantity - 1,
        };
    });

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCartEntries));

    notifyListeners();

    return nextCartEntries;
}

export function clearCart(): void {
    if (getCartEntries().length === 0) {
        return;
    }

    localStorage.removeItem(CART_STORAGE_KEY);

    notifyListeners();
}

export function removeMergedCartEntries(mergedEntries: CartEntry[]): void {
    const mergedQuantities = new Map(
        mergedEntries.map(({ productId, quantity }) => [productId, quantity]),
    );

    const cartEntries = getCartEntries();
    const nextCartEntries = cartEntries.filter(
        (entry) => mergedQuantities.get(entry.productId) !== entry.quantity,
    );

    if (nextCartEntries.length === cartEntries.length) {
        return;
    }

    if (nextCartEntries.length === 0) {
        localStorage.removeItem(CART_STORAGE_KEY);
    } else {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCartEntries));
    }

    notifyListeners();
}

import type { CartItem } from '@/lib/cart/cart.types';
import { CART_STORAGE_KEY } from '@/lib/cart/cart-storage.constants';

type CartListener = () => void;

const listeners = new Set<CartListener>();

function isCartItem(value: unknown): value is CartItem {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const item = value as Record<string, unknown>;

    return (
        typeof item.productId === 'string' &&
        typeof item.quantity === 'number' &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
}

function parseCartItems(value: string | null): CartItem[] {
    if (!value) {
        return [];
    }

    try {
        const parsed: unknown = JSON.parse(value);

        return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
    } catch {
        return [];
    }
}

function readCartItems(): CartItem[] {
    if (typeof window === 'undefined') {
        return [];
    }

    return parseCartItems(localStorage.getItem(CART_STORAGE_KEY));
}

let cartItemsSnapshot = readCartItems();

export function getCartItems(): CartItem[] {
    return cartItemsSnapshot;
}

const EMPTY_CART_ITEMS: CartItem[] = [];

export function getServerCartItems(): CartItem[] {
    return EMPTY_CART_ITEMS;
}

export function subscribeToCart(listener: CartListener): () => void {
    listeners.add(listener);

    function handleStorageChange(event: StorageEvent) {
        if (event.key !== CART_STORAGE_KEY) {
            return;
        }

        cartItemsSnapshot = readCartItems();
        listener();
    }

    window.addEventListener('storage', handleStorageChange);

    return () => {
        listeners.delete(listener);

        window.removeEventListener('storage', handleStorageChange);
    };
}

function notifyListeners(): void {
    cartItemsSnapshot = readCartItems();

    listeners.forEach((listener) => {
        listener();
    });
}

export function addCartItem(productId: string): CartItem[] {
    const cartItems = getCartItems();

    const existingItem = cartItems.find((item) => item.productId === productId);

    if (existingItem) {
        return cartItems;
    }

    const nextCartItems = [
        ...cartItems,
        {
            productId,
            quantity: 1,
        },
    ];

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCartItems));

    notifyListeners();

    return nextCartItems;
}

export function removeCartItem(productId: string): CartItem[] {
    const cartItems = getCartItems();

    const nextCartItems = cartItems.filter(
        (item) => item.productId !== productId,
    );

    if (nextCartItems.length === cartItems.length) {
        return cartItems;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCartItems));

    notifyListeners();

    return nextCartItems;
}

export function incrementCartItem(productId: string): CartItem[] {
    const cartItems = getCartItems();

    const existingItem = cartItems.find((item) => item.productId === productId);

    if (!existingItem) {
        return cartItems;
    }

    const nextCartItems = cartItems.map((item) => {
        if (item.productId !== productId) {
            return item;
        }

        return {
            ...item,
            quantity: item.quantity + 1,
        };
    });

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCartItems));

    notifyListeners();

    return nextCartItems;
}

export function decrementCartItem(productId: string): CartItem[] {
    const cartItems = getCartItems();

    const existingItem = cartItems.find((item) => item.productId === productId);

    if (!existingItem) {
        return cartItems;
    }

    if (existingItem.quantity === 1) {
        return removeCartItem(productId);
    }

    const nextCartItems = cartItems.map((item) => {
        if (item.productId !== productId) {
            return item;
        }

        return {
            ...item,
            quantity: item.quantity - 1,
        };
    });

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCartItems));

    notifyListeners();

    return nextCartItems;
}

export function clearCart(): void {
    if (getCartItems().length === 0) {
        return;
    }

    localStorage.removeItem(CART_STORAGE_KEY);

    notifyListeners();
}

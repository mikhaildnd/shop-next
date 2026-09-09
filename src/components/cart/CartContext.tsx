'use client';

import type { ReactNode } from 'react';
import {
    createContext,
    useContext,
    useEffect,
    useEffectEvent,
    useState,
} from 'react';

import { CartMergeStatus } from '@/app/(shop)/cart/_components/CartMergeStatus';
import { getProductsByIdsAction } from '@/app/(shop)/cart/actions';
import { useCartMerge } from '@/hooks/useCartMerge';
import { useLocalCart } from '@/hooks/useLocalCart';
import { useServerCart } from '@/hooks/useServerCart';
import type { CartEntry, CartProductSnapshot } from '@/lib/cart/cart.types';
import type { CartDto } from '@/services/cart/cart.types';
import type { ProductDto } from '@/services/product/product.types';

interface CartContextValue {
    cartEntries: CartEntry[];
    cartCount: number;
    getCartEntryQuantity: (productId: string) => number | undefined;
    addCartEntry: (
        productId: string,
        snapshot: CartProductSnapshot,
    ) => void | Promise<void>;
    incrementCartEntry: (productId: string) => void | Promise<void>;
    decrementCartEntry: (productId: string) => void | Promise<void>;
    removeCartEntry: (productId: string) => void | Promise<void>;
    clearCart: () => void | Promise<void>;
    isHydrated: boolean;
    products: ProductDto[];
    isLoadingProducts: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
    isAuthenticated: boolean;
    initialCartState: CartDto;
    children: ReactNode;
}

interface LocalCartProviderProps {
    children: ReactNode;
}

interface ServerCartProviderProps {
    initialCartState: CartDto;
    children: ReactNode;
}

export function CartProvider({
    isAuthenticated,
    initialCartState,
    children,
}: CartProviderProps) {
    if (isAuthenticated) {
        return (
            <ServerCartProvider initialCartState={initialCartState}>
                {children}
            </ServerCartProvider>
        );
    }

    return <LocalCartProvider>{children}</LocalCartProvider>;
}

function LocalCartProvider({ children }: LocalCartProviderProps) {
    const [products, setProducts] = useState<ProductDto[]>([]);

    const cart = useLocalCart();

    const productIdsKey = [...cart.cartEntries]
        .map((item) => item.productId)
        .sort()
        .join(',');

    const getProducts = useEffectEvent(async () => {
        return getProductsByIdsAction(
            cart.cartEntries.map((item) => item.productId),
        );
    });

    useEffect(() => {
        if (!cart.isHydrated || productIdsKey.length === 0) {
            return;
        }

        let cancelled = false;

        async function loadProducts() {
            const nextProducts = await getProducts();

            if (!cancelled) {
                setProducts(nextProducts);
            }
        }

        void loadProducts();

        return () => {
            cancelled = true;
        };
    }, [cart.isHydrated, productIdsKey]);

    const isLoadingProducts =
        cart.isHydrated &&
        cart.cartEntries.some(
            (entry) =>
                !products.some((product) => product.id === entry.productId),
        );

    const contextValue: CartContextValue = {
        cartEntries: cart.cartEntries,
        cartCount: cart.cartCount,
        getCartEntryQuantity: cart.getCartEntryQuantity,
        addCartEntry: cart.addCartEntry,
        incrementCartEntry: cart.incrementCartEntry,
        decrementCartEntry: cart.decrementCartEntry,
        removeCartEntry: cart.removeCartEntry,
        clearCart: cart.clearCart,
        isHydrated: cart.isHydrated,
        products,
        isLoadingProducts,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

function ServerCartProvider({
    initialCartState,
    children,
}: ServerCartProviderProps) {
    const cart = useServerCart({
        initialCartState,
    });

    const merge = useCartMerge({
        replaceCart: cart.replaceCart,
    });

    const [products, setProducts] = useState<ProductDto[]>(
        initialCartState.items.map(({ product }) => product),
    );

    const productIdsKey = [...cart.cartEntries]
        .map((item) => item.productId)
        .sort()
        .join(',');

    const getProducts = useEffectEvent(async () => {
        const missingProductIds = cart.cartEntries
            .map((entry) => entry.productId)
            .filter(
                (productId) =>
                    !products.some((product) => product.id === productId),
            );

        if (missingProductIds.length === 0) {
            return [];
        }

        return getProductsByIdsAction(missingProductIds);
    });

    useEffect(() => {
        if (productIdsKey.length === 0) {
            return;
        }

        let cancelled = false;

        async function loadProducts() {
            const nextProducts = await getProducts();

            if (!cancelled && nextProducts.length > 0) {
                setProducts((currentProducts) => [
                    ...currentProducts,
                    ...nextProducts,
                ]);
            }
        }

        void loadProducts();

        return () => {
            cancelled = true;
        };
    }, [productIdsKey]);

    const isLoadingProducts =
        cart.cartEntries.length > 0 &&
        cart.cartEntries.some(
            (entry) =>
                !products.some((product) => product.id === entry.productId),
        );

    const contextValue: CartContextValue = {
        cartEntries: cart.cartEntries,
        cartCount: cart.cartCount,
        getCartEntryQuantity: cart.getCartEntryQuantity,
        addCartEntry: cart.addCartEntry,
        incrementCartEntry: cart.incrementCartEntry,
        decrementCartEntry: cart.decrementCartEntry,
        removeCartEntry: cart.removeCartEntry,
        clearCart: cart.clearCart,
        isHydrated: true,
        products,
        isLoadingProducts,
    };

    return (
        <>
            <CartContext.Provider value={contextValue}>
                {children}
            </CartContext.Provider>

            <CartMergeStatus
                mergeStatus={merge.mergeStatus}
                mergeAttempt={merge.mergeAttempt}
                retryMerge={merge.retryMerge}
            />
        </>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCartContext must be used within CartProvider');
    }

    return context;
}

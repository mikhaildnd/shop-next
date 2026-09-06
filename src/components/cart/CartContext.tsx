'use client';

import type { ReactNode } from 'react';
import {
    createContext,
    useContext,
    useEffect,
    useEffectEvent,
    useRef,
    useState,
} from 'react';

import { getProductsByIdsAction } from '@/app/(shop)/cart/actions';
import { toast } from '@/components/ui/toast';
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
    mutationError: Error | null;
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
    const cart = useLocalCart();
    const [products, setProducts] = useState<ProductDto[]>([]);

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
        mutationError: cart.mutationError,
        isHydrated: cart.isHydrated,
        products,
        isLoadingProducts,
    };

    useEffect(() => {
        if (cart.mutationError) {
            toast.add({
                id: 'cart-mutation-error',
                description: 'Произошла ошибка. Попробуйте ещё раз',
                type: 'error',
            });
        }
    }, [cart.mutationError]);

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
        mutationError: cart.mutationError,
        isHydrated: true,
        products,
        isLoadingProducts,
    };

    const mergeToastId = useRef<string | null>(null);

    useEffect(() => {
        if (cart.mergeStatus === 'merging') {
            if (cart.mergeAttempt === 0) {
                return;
            }
            if (mergeToastId.current) {
                toast.update(mergeToastId.current, {
                    description: 'Синхронизация корзины...',
                    type: 'loading',
                    timeout: 0,
                    actionProps: undefined,
                });
            } else {
                mergeToastId.current = toast.add({
                    description: 'Синхронизация корзины...',
                    type: 'loading',
                    timeout: 0,
                });
            }

            return;
        }

        if (cart.mergeStatus === 'error') {
            if (!mergeToastId.current) {
                mergeToastId.current = toast.add({
                    description: 'Не удалось синхронизировать корзину',
                    type: 'error',
                    timeout: 0,
                    actionProps: {
                        children: 'Повторить',
                        onClick: cart.retryMerge,
                    },
                });

                return;
            }

            toast.update(mergeToastId.current, {
                description: 'Не удалось синхронизировать корзину',
                type: 'error',
                timeout: 0,
                actionProps: {
                    children: 'Повторить',
                    onClick: cart.retryMerge,
                },
            });

            return;
        }

        if (mergeToastId.current) {
            toast.close(mergeToastId.current);
            mergeToastId.current = null;
        }
    }, [cart.mergeAttempt, cart.mergeStatus, cart.retryMerge]);

    useEffect(() => {
        if (cart.mutationError) {
            toast.add({
                id: 'cart-mutation-error',
                description: 'Произошла ошибка. Попробуйте ещё раз',
                type: 'error',
            });
        }
    }, [cart.mutationError]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCartContext must be used within CartProvider');
    }

    return context;
}

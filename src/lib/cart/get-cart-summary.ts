import type { CartItemData } from '@/lib/cart/cart.types';

export type CartSummaryData = {
    regularPriceTotal: number;
    effectivePriceTotal: number;
    selectedCartCount: number;
    discountAmount: number;
    hasStockIssues: boolean;
    isCheckoutDisabled: boolean;
};

export function getCartSummary(cartItems: CartItemData[]): CartSummaryData {
    const regularPriceTotal = cartItems.reduce(
        (sum, { product, quantity }) => sum + product.regularPrice * quantity,
        0,
    );

    const effectivePriceTotal = cartItems.reduce(
        (sum, { product, quantity }) => sum + product.effectivePrice * quantity,
        0,
    );

    const selectedCartCount = cartItems.reduce(
        (sum, { quantity }) => sum + quantity,
        0,
    );

    const discountAmount = regularPriceTotal - effectivePriceTotal;

    const hasStockIssues = cartItems.some(
        (item) => item.quantity > item.product.stock,
    );

    const isCheckoutDisabled = cartItems.length === 0 || hasStockIssues;

    return {
        regularPriceTotal,
        effectivePriceTotal,
        selectedCartCount,
        discountAmount,
        hasStockIssues,
        isCheckoutDisabled,
    };
}

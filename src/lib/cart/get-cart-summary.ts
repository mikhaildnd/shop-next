import type { CartItemData } from '@/lib/cart/cart.types';

export type CartSummaryData = {
    regularPriceTotal: number;
    effectivePriceTotal: number;
    availableCartCount: number;
    discountAmount: number;
    hasStockIssues: boolean;
    isCheckoutDisabled: boolean;
};

export function getCartSummary(
    availableCartItems: CartItemData[],
): CartSummaryData {
    const regularPriceTotal = availableCartItems.reduce(
        (sum, { product, quantity }) => sum + product.regularPrice * quantity,
        0,
    );

    const effectivePriceTotal = availableCartItems.reduce(
        (sum, { product, quantity }) => sum + product.effectivePrice * quantity,
        0,
    );

    const availableCartCount = availableCartItems.reduce(
        (sum, { quantity }) => sum + quantity,
        0,
    );

    const discountAmount = regularPriceTotal - effectivePriceTotal;

    const hasStockIssues = availableCartItems.some(
        (item) => item.quantity > item.product.stock,
    );

    const isCheckoutDisabled =
        availableCartItems.length === 0 || hasStockIssues;

    return {
        regularPriceTotal,
        effectivePriceTotal,
        availableCartCount,
        discountAmount,
        hasStockIssues,
        isCheckoutDisabled,
    };
}

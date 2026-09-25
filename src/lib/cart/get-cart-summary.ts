import type { CartItemData } from '@/lib/cart/cart.types';

export type CartSummaryData = {
    regularPriceTotal: number;
    effectivePriceTotal: number;
    availableCartCount: number;
    discountAmount: number;
    hasPriceChanges: boolean;
    hasStockIssues: boolean;
    isCheckoutDisabled: boolean;
};

export function getCartSummary(items: CartItemData[]): CartSummaryData {
    const availableItems = items.flatMap((item) => {
        if (!item.product || item.product.stock === 0) {
            return [];
        }

        return [{ item, product: item.product }];
    });
    const hasMissingProducts = items.some((item) => item.product === null);

    const regularPriceTotal = availableItems.reduce(
        (sum, { item, product }) => sum + product.regularPrice * item.quantity,
        0,
    );

    const effectivePriceTotal = availableItems.reduce(
        (sum, { item, product }) =>
            sum + product.effectivePrice * item.quantity,
        0,
    );

    const availableCartCount = availableItems.reduce(
        (sum, { item }) => sum + item.quantity,
        0,
    );

    const discountAmount = regularPriceTotal - effectivePriceTotal;

    const hasPriceChanges = items.some(
        (item) =>
            item.product !== null &&
            item.snapshot.effectivePrice !== item.product.effectivePrice,
    );

    const hasStockIssues = items.some(
        (item) =>
            item.product !== null &&
            item.product.stock > 0 &&
            item.quantity > item.product.stock,
    );

    const isCheckoutDisabled =
        availableItems.length === 0 || hasMissingProducts || hasStockIssues;

    return {
        regularPriceTotal,
        effectivePriceTotal,
        availableCartCount,
        discountAmount,
        hasPriceChanges,
        hasStockIssues,
        isCheckoutDisabled,
    };
}

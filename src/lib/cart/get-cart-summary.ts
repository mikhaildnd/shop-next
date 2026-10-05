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
        if (item.product.stock === 0) {
            return [];
        }

        const availableQuantity = Math.min(item.quantity, item.product.stock);

        return [{ product: item.product, availableQuantity }];
    });

    const regularPriceTotal = availableItems.reduce(
        (sum, { product, availableQuantity }) =>
            sum + product.regularPrice * availableQuantity,
        0,
    );

    const effectivePriceTotal = availableItems.reduce(
        (sum, { product, availableQuantity }) =>
            sum + product.effectivePrice * availableQuantity,
        0,
    );

    const availableCartCount = availableItems.reduce(
        (sum, { availableQuantity }) => sum + availableQuantity,
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

    const isCheckoutDisabled = availableItems.length === 0 || hasStockIssues;

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

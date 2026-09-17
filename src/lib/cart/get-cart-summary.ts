import type { CartItemDto } from '@/services/cart/cart.types';

type CartSummaryData = {
    availableItems: CartItemDto[];
    unavailableItems: CartItemDto[];
    regularPriceTotal: number;
    effectivePriceTotal: number;
    availableCartCount: number;
    discountAmount: number;
    hasPriceChanges: boolean;
    hasStockIssues: boolean;
    isCheckoutDisabled: boolean;
};

export function getCartSummary(items: CartItemDto[]): CartSummaryData {
    const availableItems = items.filter((item) => item.product.stock > 0);
    const unavailableItems = items.filter((item) => item.product.stock === 0);

    const regularPriceTotal = availableItems.reduce(
        (sum, item) => sum + item.product.regularPrice * item.quantity,
        0,
    );

    const effectivePriceTotal = availableItems.reduce(
        (sum, item) => sum + item.product.effectivePrice * item.quantity,
        0,
    );

    const availableCartCount = availableItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );

    const discountAmount = regularPriceTotal - effectivePriceTotal;

    const hasPriceChanges = items.some(
        (item) => item.snapshot.effectivePrice !== item.product.effectivePrice,
    );

    const hasStockIssues = items.some(
        (item) => item.product.stock > 0 && item.quantity > item.product.stock,
    );

    const isCheckoutDisabled = availableItems.length === 0 || hasStockIssues;

    return {
        availableItems,
        unavailableItems,
        regularPriceTotal,
        effectivePriceTotal,
        availableCartCount,
        discountAmount,
        hasPriceChanges,
        hasStockIssues,
        isCheckoutDisabled,
    };
}

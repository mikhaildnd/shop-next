'use server';

import {
    createAnonymousSession,
    getSession,
    requireSession,
} from '@/auth/session';
import {
    addCartItem,
    clearCart,
    getReconciledCart,
    removeCartItem,
    removeCartItems,
    setAllCartItemsSelection,
    setCartItemQuantity,
    setCartItemSelection,
    updateCartItemPriceSnapshots,
} from '@/services/cart/cart.service';
import type { CartData } from '@/services/cart/cart.types';

export async function addCartItemAction(productId: string): Promise<CartData> {
    if (typeof productId !== 'string' || productId.trim().length === 0) {
        throw new Error('Invalid product ID');
    }

    const session = await getSession();

    if (session) {
        await addCartItem(session.user.id, productId);

        return getReconciledCart(session.user.id);
    }

    const anonymousSession = await createAnonymousSession();

    await addCartItem(anonymousSession.user.id, productId);

    return getReconciledCart(anonymousSession.user.id);
}

export async function setCartItemQuantityAction(
    productId: string,
    quantity: number,
): Promise<CartData> {
    if (
        typeof productId !== 'string' ||
        productId.trim().length === 0 ||
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {
        throw new Error('Invalid cart item quantity');
    }

    const session = await requireSession();

    await setCartItemQuantity(session.user.id, productId, quantity);

    return getReconciledCart(session.user.id);
}

export async function removeCartItemAction(
    productId: string,
): Promise<CartData> {
    if (typeof productId !== 'string' || productId.trim().length === 0) {
        throw new Error('Invalid product ID');
    }

    const session = await requireSession();

    await removeCartItem(session.user.id, productId);

    return getReconciledCart(session.user.id);
}

export async function removeCartItemsAction(
    productIds: string[],
): Promise<CartData> {
    if (
        !Array.isArray(productIds) ||
        !productIds.every(
            (id) => typeof id === 'string' && id.trim().length > 0,
        )
    ) {
        throw new Error('Invalid product IDs');
    }

    const session = await requireSession();

    await removeCartItems(session.user.id, productIds);

    return getReconciledCart(session.user.id);
}

export async function clearCartAction(): Promise<void> {
    const session = await requireSession();

    return clearCart(session.user.id);
}

export async function updateCartItemPriceSnapshotsAction(
    confirmations: {
        productId: string;
        effectivePrice: number;
    }[],
): Promise<CartData> {
    if (
        !Array.isArray(confirmations) ||
        confirmations.some(
            (confirmation) =>
                !confirmation ||
                typeof confirmation.productId !== 'string' ||
                confirmation.productId.trim().length === 0 ||
                typeof confirmation.effectivePrice !== 'number' ||
                !Number.isFinite(confirmation.effectivePrice),
        ) ||
        new Set(confirmations.map((item) => item.productId)).size !==
            confirmations.length
    ) {
        throw new Error('Invalid price confirmations');
    }

    const session = await requireSession();

    await updateCartItemPriceSnapshots(session.user.id, confirmations);

    return getReconciledCart(session.user.id);
}

export async function setCartItemSelectionAction(
    productId: string,
    isSelected: boolean,
): Promise<CartData> {
    if (
        typeof productId !== 'string' ||
        productId.trim().length === 0 ||
        typeof isSelected !== 'boolean'
    ) {
        throw new Error('Invalid cart item selection');
    }

    const session = await requireSession();

    await setCartItemSelection(session.user.id, productId, isSelected);

    return getReconciledCart(session.user.id);
}

export async function setAllCartItemsSelectionAction(
    isSelected: boolean,
): Promise<CartData> {
    if (typeof isSelected !== 'boolean') {
        throw new Error('Invalid selection state');
    }

    const session = await requireSession();

    await setAllCartItemsSelection(session.user.id, isSelected);

    return getReconciledCart(session.user.id);
}

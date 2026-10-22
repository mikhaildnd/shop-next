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
    setCartItemQuantity,
    updateCartItemPriceSnapshots,
} from '@/services/cart/cart.service';
import type { CartData } from '@/services/cart/cart.types';

export async function addCartItemAction(productId: string): Promise<CartData> {
    const session = await getSession();

    if (session) {
        return addCartItem(session.user.id, productId);
    }

    const anonymousSession = await createAnonymousSession();

    return addCartItem(anonymousSession.user.id, productId);
}

export async function setCartItemQuantityAction(
    productId: string,
    quantity: number,
): Promise<CartData> {
    const session = await requireSession();
    const userId = session.user.id;

    await setCartItemQuantity(userId, productId, quantity);

    return getReconciledCart(userId);
}

export async function removeCartItemAction(
    productId: string,
): Promise<CartData> {
    const session = await requireSession();

    return removeCartItem(session.user.id, productId);
}

export async function clearCartAction(): Promise<CartData> {
    const session = await requireSession();

    return clearCart(session.user.id);
}

export async function updateCartItemPriceSnapshotsAction(
    productIds: string[],
): Promise<void> {
    const session = await requireSession();

    if (
        !Array.isArray(productIds) ||
        productIds.some((productId) => typeof productId !== 'string')
    ) {
        throw new Error('Invalid product IDs');
    }

    const userId = session.user.id;

    await updateCartItemPriceSnapshots(userId, productIds);
}

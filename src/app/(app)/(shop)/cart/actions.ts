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
    const session = await requireSession();

    await setCartItemQuantity(session.user.id, productId, quantity);

    return getReconciledCart(session.user.id);
}

export async function removeCartItemAction(
    productId: string,
): Promise<CartData> {
    const session = await requireSession();

    await removeCartItem(session.user.id, productId);

    return getReconciledCart(session.user.id);
}

export async function clearCartAction(): Promise<CartData> {
    const session = await requireSession();

    return clearCart(session.user.id);
}

export async function updateCartItemPriceSnapshotsAction(
    confirmations: {
        productId: string;
        effectivePrice: number;
    }[],
): Promise<CartData> {
    const session = await requireSession();

    if (
        !Array.isArray(confirmations) ||
        confirmations.some(
            (confirmation) =>
                !confirmation ||
                typeof confirmation.productId !== 'string' ||
                typeof confirmation.effectivePrice !== 'number' ||
                !Number.isFinite(confirmation.effectivePrice),
        )
    ) {
        throw new Error('Invalid price confirmations');
    }

    await updateCartItemPriceSnapshots(session.user.id, confirmations);

    return getReconciledCart(session.user.id);
}

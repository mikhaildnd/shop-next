'use server';

import {
    createAnonymousSession,
    getSession,
    requireSession,
} from '@/auth/session';
import type { CartItemSnapshot } from '@/lib/cart/cart.types';
import {
    addCartItem,
    clearCart,
    getReconciledCartData,
    removeCartItem,
    setCartItemQuantity,
} from '@/services/cart/cart.service';
import type { CartData } from '@/services/cart/cart.types';

export async function addCartItemAction(
    productId: string,
    snapshot: CartItemSnapshot,
): Promise<CartData> {
    const session = await getSession();

    if (session) {
        return addCartItem(session.user.id, productId, snapshot);
    }

    const anonymousSession = await createAnonymousSession();

    return addCartItem(anonymousSession.user.id, productId, snapshot);
}

export async function setCartItemQuantityAction(
    productId: string,
    quantity: number,
): Promise<CartData> {
    const session = await requireSession();
    const userId = session.user.id;

    await setCartItemQuantity(userId, productId, quantity);

    return getReconciledCartData(userId);
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

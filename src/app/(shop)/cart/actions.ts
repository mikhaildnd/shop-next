'use server';

import { headers } from 'next/headers';

import { auth } from '@/auth/auth';
import { getSession, requireSession } from '@/auth/session';
import type { CartItemSnapshot } from '@/lib/cart/cart.types';
import { getCartQuantityAdjustments } from '@/lib/cart/get-сart-quantity-adjustments';
import {
    addCartItem,
    applyCartQuantityAdjustments,
    clearCart,
    getCartData,
    removeCartItem,
    setCartItemQuantity,
} from '@/services/cart/cart.service';
import type { CartData } from '@/services/cart/cart.types';

async function getCartUserId() {
    const session = await getSession();

    if (session) {
        return session.user.id;
    }

    const result = await auth.api.signInAnonymous({
        headers: await headers(),
    });

    return result.user.id;
}

export async function addCartItemAction(
    productId: string,
    snapshot: CartItemSnapshot,
): Promise<CartData> {
    const userId = await getCartUserId();

    return addCartItem(userId, productId, snapshot);
}

export async function setCartItemQuantityAction(
    productId: string,
    quantity: number,
): Promise<CartData> {
    const session = await requireSession();
    const userId = session.user.id;

    await setCartItemQuantity(userId, productId, quantity);

    const cartData = await getCartData(userId);

    const adjustments = getCartQuantityAdjustments(
        cartData.cart,
        cartData.products,
    );

    if (adjustments.length === 0) {
        return cartData;
    }

    await applyCartQuantityAdjustments(userId, adjustments);

    return getCartData(userId);
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

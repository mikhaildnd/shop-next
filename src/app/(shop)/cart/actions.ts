'use server';

import { headers } from 'next/headers';

import { auth } from '@/auth/auth';
import { getSession, requireSession } from '@/auth/session';
import type { CartItemSnapshot } from '@/lib/cart/cart.types';
import {
    addCartItem,
    clearCart,
    decrementCartItem,
    getCartProductsByIds,
    incrementCartItem,
    removeCartItem,
    setCartItemQuantity,
} from '@/services/cart/cart.service';
import type { CartDto } from '@/services/cart/cart.types';

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
): Promise<void> {
    const userId = await getCartUserId();

    await addCartItem(userId, productId, snapshot);
}

export async function setCartItemQuantityAction(
    productId: string,
    quantity: number,
): Promise<CartDto> {
    const session = await requireSession();

    return setCartItemQuantity(session.user.id, productId, quantity);
}

export async function incrementCartItemAction(
    productId: string,
): Promise<void> {
    const session = await requireSession();

    await incrementCartItem(session.user.id, productId);
}

export async function decrementCartItemAction(
    productId: string,
): Promise<void> {
    const session = await requireSession();

    await decrementCartItem(session.user.id, productId);
}

export async function removeCartItemAction(productId: string): Promise<void> {
    const session = await requireSession();

    await removeCartItem(session.user.id, productId);
}

export async function clearCartAction(): Promise<void> {
    const session = await requireSession();

    await clearCart(session.user.id);
}

export async function getCartProductsByIdsAction(productIds: string[]) {
    return getCartProductsByIds(productIds);
}

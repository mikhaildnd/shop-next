'use server';

import { headers } from 'next/headers';

import { auth } from '@/auth/auth';
import { getSession, requireSession } from '@/auth/session';
import type { CartItemSnapshot } from '@/lib/cart/cart.types';
import {
    addCartItem,
    clearCart,
    decrementCartItem,
    incrementCartItem,
    removeCartItem,
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

export async function incrementCartItemAction(
    productId: string,
): Promise<CartData> {
    const session = await requireSession();

    return incrementCartItem(session.user.id, productId);
}

export async function decrementCartItemAction(
    productId: string,
): Promise<CartData> {
    const session = await requireSession();

    return decrementCartItem(session.user.id, productId);
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

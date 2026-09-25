'use server';

import { requireSession } from '@/auth/session';
import type { CartEntry, CartItemSnapshot } from '@/lib/cart/cart.types';
import {
    addCartItem,
    clearCart,
    decrementCartItem,
    getCartProductsByIds,
    incrementCartItem,
    mergeCart,
    removeCartItem,
} from '@/services/cart/cart.service';

export async function addCartItemAction(
    productId: string,
    snapshot: CartItemSnapshot,
): Promise<void> {
    const session = await requireSession();

    await addCartItem(session.user.id, productId, snapshot);
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

export async function mergeCartAction(entries: CartEntry[]) {
    const session = await requireSession();

    return mergeCart(session.user.id, entries);
}

export async function getCartProductsByIdsAction(productIds: string[]) {
    return getCartProductsByIds(productIds);
}

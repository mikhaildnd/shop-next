'use server';

import { requireSession } from '@/auth/session';
import type { CartEntry } from '@/lib/cart/cart.types';
import {
    addCartItem,
    clearCart,
    decrementCartItem,
    incrementCartItem,
    mergeCart,
    removeCartItem,
} from '@/services/cart/cart.service';
import { getProductsByIds } from '@/services/product/product.service';

export async function addCartItemAction(productId: string) {
    const session = await requireSession();

    await addCartItem(session.user.id, productId);
}

export async function incrementCartItemAction(productId: string) {
    const session = await requireSession();

    await incrementCartItem(session.user.id, productId);
}

export async function decrementCartItemAction(productId: string) {
    const session = await requireSession();

    await decrementCartItem(session.user.id, productId);
}

export async function removeCartItemAction(productId: string) {
    const session = await requireSession();

    await removeCartItem(session.user.id, productId);
}

export async function clearCartAction() {
    const session = await requireSession();

    await clearCart(session.user.id);
}

export async function mergeCartAction(entries: CartEntry[]) {
    const session = await requireSession();

    return mergeCart(session.user.id, entries);
}

export async function getProductsByIdsAction(productIds: string[]) {
    return getProductsByIds(productIds);
}

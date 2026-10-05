'use client';

import { ImageOff, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { CartItemRemoveButton } from '@/app/(shop)/cart/_components/CartItemRemoveButton';
import { useCartContext } from '@/components/cart/CartContext';
import { CartItemQuantity } from '@/components/cart/CartItemQuantity';
import { DeletionDialog } from '@/components/DeletionDialog';
import { FavoriteButton } from '@/components/favorite/FavoriteButton';
import type { CartItemData } from '@/lib/cart/cart.types';
import { cn } from '@/lib/cn';
import { formatMeasureValue } from '@/lib/format-measure-value';
import { formatPrice } from '@/lib/format-price';
import { routes } from '@/routes';

interface CartItemProps {
    item: CartItemData;
}

export function CartItem({ item }: CartItemProps) {
    const { removeCartItem } = useCartContext();

    const wasQuantityAdjusted = item.quantityAdjustedFrom !== null;

    const hasDiscount = item.product.discountPercent > 0;

    const priceChanged =
        item.snapshot.effectivePrice !== item.product.effectivePrice;

    const measure = formatMeasureValue(
        item.product.measureValue,
        item.product.measureType,
    );

    const lineRegular = formatPrice(item.quantity * item.product.regularPrice);

    const lineTotal = formatPrice(item.quantity * item.product.effectivePrice);

    const isOutOfStock = item.product.stock === 0;

    return (
        <article className="flex gap-2 bg-white py-2 sm:gap-4 md:py-4">
            <div className="relative size-24 shrink-0 overflow-hidden rounded">
                {item.product.imageUrl ? (
                    <Link
                        href={routes.productPage(item.product.slug)}
                        className="absolute inset-0"
                    >
                        <Image
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            fill
                            className={cn(
                                'object-cover',
                                isOutOfStock && 'opacity-60 grayscale',
                            )}
                            sizes="96px"
                        />
                    </Link>
                ) : (
                    <div className="flex size-full items-center justify-center">
                        <ImageOff
                            aria-hidden="true"
                            className="size-10 text-gray-300"
                        />
                    </div>
                )}
            </div>

            <div className="flex min-w-0 flex-col gap-2">
                <Link
                    href={routes.productPage(item.product.slug)}
                    className={cn(
                        'line-clamp-3 text-[#414141] hover:text-(--color-primary) hover:underline',
                        isOutOfStock && 'text-gray-500',
                    )}
                >
                    {item.product.title}
                </Link>

                <p className="text-xs text-gray-500">1 товар • {measure}</p>

                {!isOutOfStock ? (
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-[#414141]">
                            {lineTotal} ₸
                        </p>

                        {hasDiscount && (
                            <>
                                <p className="text-sm text-[#bfbfbf] line-through">
                                    {lineRegular} ₸
                                </p>

                                <div className="rounded-sm bg-[#ff6633] px-2 py-1 text-sm text-white">
                                    -{item.product.discountPercent}%
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">Товар закончился</p>
                )}

                {wasQuantityAdjusted && !isOutOfStock && (
                    <p className="flex items-center gap-3 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-500">
                        <Info className="size-5 shrink-0" />
                        <span>
                            Количество товара было уменьшено из-за недостатка на
                            складе.
                        </span>
                    </p>
                )}

                <div className="mt-auto flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 sm:gap-4">
                        {!isOutOfStock && (
                            <div className="flex flex-col items-center gap-2">
                                <CartItemQuantity
                                    productId={item.productId}
                                    quantity={item.displayQuantity}
                                    maxQuantity={item.product.stock}
                                    size="sm"
                                    variant="neutral"
                                />

                                <p className="flex items-baseline gap-2 text-sm text-gray-500">
                                    <span>
                                        {formatPrice(
                                            item.product.effectivePrice,
                                        )}{' '}
                                        ₸/ед.
                                    </span>

                                    {priceChanged && (
                                        <span className="text-gray-400 line-through">
                                            {formatPrice(
                                                item.snapshot.effectivePrice,
                                            )}{' '}
                                            ₸/ед.
                                        </span>
                                    )}
                                </p>
                            </div>
                        )}

                        <DeletionDialog
                            trigger={
                                <CartItemRemoveButton
                                    className="bg-gray-50"
                                    shape="rounded"
                                />
                            }
                            title="Удалить товар?"
                            description="Товар будет удалён из корзины."
                            onConfirm={() => removeCartItem(item.productId)}
                        />

                        <FavoriteButton
                            productId={item.productId}
                            className="bg-gray-50"
                            shape="rounded"
                        />
                    </div>
                </div>
            </div>
        </article>
    );
}

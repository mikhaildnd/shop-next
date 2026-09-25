'use client';

import { ImageOff, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { CartItemRemoveButton } from '@/app/(shop)/cart/_components/CartItemRemoveButton';
import { Button } from '@/components/button/Button';
import { useCartContext } from '@/components/cart/CartContext';
import { CartItemQuantity } from '@/components/cart/CartItemQuantity';
import { FavoriteButton } from '@/components/favorite/FavoriteButton';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { CartItemData } from '@/lib/cart/cart.types';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/format-price';
import { routes } from '@/routes';

interface CartItemProps {
    item: CartItemData;
}

export function CartItem({ item }: CartItemProps) {
    const { removeCartItem } = useCartContext();

    const hasDiscount =
        item.product !== null && item.product.discountPercent > 0;

    const priceChanged =
        item.product !== null &&
        item.snapshot.effectivePrice !== item.product.effectivePrice;

    const isOutOfStock = item.product?.stock === 0;

    const hasInsufficientStock =
        item.product !== null &&
        item.product.stock > 0 &&
        item.quantity > item.product.stock;

    return (
        <article className="flex gap-2 bg-white py-2 sm:gap-4 md:py-4">
            <div className="relative size-24 shrink-0 overflow-hidden rounded">
                {item.snapshot.imageUrl ? (
                    item.product ? (
                        <Link
                            href={routes.productPage(item.product.slug)}
                            className="absolute inset-0"
                        >
                            <Image
                                src={item.snapshot.imageUrl}
                                alt={item.snapshot.title}
                                fill
                                className={cn(
                                    'object-cover',
                                    isOutOfStock && 'opacity-60 grayscale',
                                )}
                                sizes="96px"
                            />
                        </Link>
                    ) : (
                        <Image
                            src={item.snapshot.imageUrl}
                            alt={item.snapshot.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                        />
                    )
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
                {item.product ? (
                    <Link
                        href={routes.productPage(item.product.slug)}
                        className={cn(
                            'line-clamp-3 text-[#414141] hover:text-(--color-primary) hover:underline',
                            isOutOfStock && 'opacity-60',
                        )}
                    >
                        {item.snapshot.title}
                    </Link>
                ) : (
                    <p className="line-clamp-3 text-[#414141]">
                        {item.snapshot.title}
                    </p>
                )}

                {!isOutOfStock ? (
                    <>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-[#414141]">
                                {formatPrice(
                                    item.product?.effectivePrice ??
                                        item.snapshot.effectivePrice,
                                )}{' '}
                                ₸
                            </p>

                            {item.product && hasDiscount && (
                                <p className="text-sm text-[#bfbfbf] line-through">
                                    {formatPrice(item.product.regularPrice)} ₸
                                </p>
                            )}
                        </div>

                        {priceChanged && (
                            <p className="text-sm text-amber-700">
                                Старая цена:{' '}
                                {formatPrice(item.snapshot.effectivePrice)} ₸
                            </p>
                        )}
                    </>
                ) : (
                    <p className="text-sm text-[#414141] opacity-60">
                        Товар закончился
                    </p>
                )}

                <div className="mt-auto flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2 sm:gap-4">
                        {!isOutOfStock && (
                            <CartItemQuantity
                                productId={item.productId}
                                maxQuantity={item.product?.stock}
                                size="sm"
                                variant="neutral"
                            />
                        )}

                        <AlertDialog>
                            <AlertDialogTrigger
                                render={
                                    <CartItemRemoveButton
                                        className="bg-gray-50"
                                        shape="rounded"
                                    />
                                }
                            />
                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                        <Trash2Icon />
                                    </AlertDialogMedia>
                                    <AlertDialogTitle>
                                        Удалить товар?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Товар будет удалён из корзины.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel
                                        render={
                                            <Button
                                                size="sm"
                                                variant="neutral"
                                            >
                                                Отмена
                                            </Button>
                                        }
                                    />
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            removeCartItem(item.productId)
                                        }
                                    >
                                        Удалить
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <FavoriteButton
                            productId={item.productId}
                            className="bg-gray-50"
                            shape="rounded"
                        />
                    </div>

                    {hasInsufficientStock && (
                        <p className="text-sm text-amber-700">
                            Доступно только {item.product?.stock} шт.
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

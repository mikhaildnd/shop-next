'use client';

import { Trash2Icon } from 'lucide-react';
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
import type { CartEntry } from '@/lib/cart/cart.types';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/format-price';
import { routes } from '@/routes';
import type { CartProductLookup } from '@/services/cart/cart.types';

interface CartItemProps {
    entry: CartEntry;
    product?: CartProductLookup;
}

export function CartItem({ entry, product }: CartItemProps) {
    const { snapshot } = entry;
    const { removeCartItem } = useCartContext();

    const hasDiscount = product !== undefined && product.discountPercent > 0;

    const priceChanged =
        product !== undefined &&
        snapshot.effectivePrice !== product.effectivePrice;

    const isOutOfStock = product?.stock === 0;
    const hasInsufficientStock =
        product !== undefined &&
        product.stock > 0 &&
        entry.quantity > product.stock;

    return (
        <article className="flex gap-2 bg-white py-2 sm:gap-4 md:py-4">
            {product ? (
                <Link
                    href={routes.productPage(product.slug)}
                    className="relative size-24 shrink-0 overflow-hidden rounded"
                >
                    {snapshot.imageUrl && (
                        <Image
                            src={snapshot.imageUrl}
                            alt={snapshot.title}
                            fill
                            className={cn(
                                'object-cover',
                                isOutOfStock && 'opacity-60 grayscale',
                            )}
                            sizes="96px"
                        />
                    )}
                </Link>
            ) : (
                <div className="relative size-24 shrink-0 overflow-hidden rounded">
                    {snapshot.imageUrl && (
                        <Image
                            src={snapshot.imageUrl}
                            alt={snapshot.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                        />
                    )}
                </div>
            )}

            <div className="flex min-w-0 flex-col gap-2">
                {product ? (
                    <Link
                        href={routes.productPage(product.slug)}
                        className={cn(
                            'line-clamp-3 text-[#414141] hover:text-(--color-primary) hover:underline',
                            isOutOfStock && 'opacity-60',
                        )}
                    >
                        {snapshot.title}
                    </Link>
                ) : (
                    <p className="line-clamp-3 text-[#414141]">{snapshot.title}</p>
                )}

                {product ? (
                    !isOutOfStock ? (
                        <>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-[#414141]">
                                    {formatPrice(product.effectivePrice)} ₸
                                </p>

                                {hasDiscount && (
                                    <p className="text-sm text-[#bfbfbf] line-through">
                                        {formatPrice(product.regularPrice)} ₸
                                    </p>
                                )}
                            </div>

                            {priceChanged && (
                                <p className="text-sm text-amber-700">
                                    Старая цена:{' '}
                                    {formatPrice(snapshot.effectivePrice)} ₸
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-[#414141] opacity-60">
                            Товар закончился
                        </p>
                    )
                ) : (
                    <p className="text-sm text-gray-500">
                        Проверяем актуальные данные товара...
                    </p>
                )}

                <div className="mt-auto flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2 sm:gap-4">
                        {product && !isOutOfStock && (
                            <CartItemQuantity
                                productId={entry.productId}
                                maxQuantity={product.stock}
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
                                            removeCartItem(entry.productId)
                                        }
                                    >
                                        Удалить
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <FavoriteButton
                            productId={entry.productId}
                            className="bg-gray-50"
                            shape="rounded"
                        />
                    </div>

                    {hasInsufficientStock && (
                        <p className="text-sm text-amber-700">
                            Доступно только {product.stock} шт.
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

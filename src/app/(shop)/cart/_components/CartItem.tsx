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
import { formatPrice } from '@/lib/format-price';
import { routes } from '@/routes';
import type { CartItemDto } from '@/services/cart/cart.types';

interface CartItemProps {
    item: CartItemDto;
}

export function CartItem({ item }: CartItemProps) {
    const { product } = item;

    const hasDiscount = product.discountPercent > 0;

    const priceChanged =
        item.snapshot.effectivePrice !== product.effectivePrice;

    const mainImage = product.images[0];

    const { removeCartEntry } = useCartContext();

    return (
        <article className="flex gap-4 py-4">
            <Link
                href={routes.productPage(product.slug)}
                className="relative size-24 shrink-0 overflow-hidden rounded"
            >
                {mainImage && (
                    <Image
                        src={mainImage.url}
                        alt={mainImage.alt ?? product.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                    />
                )}
            </Link>

            <div className="flex min-w-0 flex-col gap-2">
                <Link
                    href={routes.productPage(product.slug)}
                    className="line-clamp-2 text-[#414141] hover:text-(--color-primary) hover:underline"
                >
                    {product.title}
                </Link>

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
                        Старая цена: {formatPrice(item.snapshot.effectivePrice)}{' '}
                        ₸
                    </p>
                )}

                <div className="mt-auto flex items-center gap-4">
                    <CartItemQuantity
                        productId={product.id}
                        size="sm"
                        variant="neutral"
                    />

                    <AlertDialog>
                        <AlertDialogTrigger render={<CartItemRemoveButton />} />
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
                                    onClick={() => removeCartEntry(product.id)}
                                >
                                    Удалить
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <FavoriteButton productId={product.id} />
                </div>
            </div>
        </article>
    );
}

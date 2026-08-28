import Image from 'next/image';
import Link from 'next/link';

import { CartItemRemoveButton } from '@/app/(shop)/cart/_components/CartItemRemoveButton';
import { CartItemQuantity } from '@/components/cart/CartItemQuantity';
import { FavoriteButton } from '@/components/favorite/FavoriteButton';
import { formatPrice } from '@/lib/format-price';
import { routes } from '@/routes';
import type { CartItemDto } from '@/services/cart/cart.types';

interface CartItemsProps {
    items: CartItemDto[];
}

export function CartItems({ items }: CartItemsProps) {
    return (
        <div className="flex flex-col divide-y divide-gray-200 rounded bg-white">
            {items.map((item) => {
                const { product } = item;
                const hasDiscount = product.discountPercent > 0;
                const mainImage = product.images[0];

                return (
                    <article
                        key={product.id}
                        className="flex gap-4 p-4"
                    >
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

                            <div className="mt-auto flex items-center gap-4">
                                <CartItemQuantity
                                    productId={product.id}
                                    size="sm"
                                    variant="neutral"
                                />

                                <CartItemRemoveButton productId={product.id} />

                                <FavoriteButton productId={product.id} />
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

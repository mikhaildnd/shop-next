import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { CartButton } from '@/components/cart/CartButton';
import { FavoriteButton } from '@/components/favorite/FavoriteButton';
import { StarRating } from '@/components/product/StarRating';
import { formatPrice } from '@/lib/format-price';
import type { ProductDto } from '@/services/product/product.types';

interface ProductCardProps {
    product: ProductDto;
    href: string;
}

export function ProductCard({ product, href }: ProductCardProps) {
    const hasDiscount = product.discountPercent > 0;

    const mainImage = product.images[0];

    return (
        <article className="flex h-full w-full flex-col overflow-hidden rounded bg-white">
            {/*MEDIA SECTION*/}
            <div className="relative aspect-square w-full">
                <Link
                    href={href}
                    className="absolute inset-0"
                >
                    {mainImage ? (
                        <Image
                            src={mainImage.url}
                            alt={mainImage.alt ?? product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 160px, (max-width: 1280px) 224px, 272px"
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center bg-gray-50">
                            <ImageOff
                                aria-hidden="true"
                                className="size-12 text-gray-300"
                            />
                        </div>
                    )}
                </Link>

                {/*FAVORITE BUTTON*/}
                <FavoriteButton
                    productId={product.id}
                    className="absolute top-2 right-2 bg-white opacity-80"
                    shape="round"
                />

                {/*DISCOUNT PLATE*/}
                {hasDiscount && (
                    <div className="absolute bottom-2.5 left-2.5 rounded-sm bg-[#ff6633] px-2 py-1 text-sm text-white">
                        -{product.discountPercent}%
                    </div>
                )}
            </div>

            {/*CONTENT SECTION*/}
            <div className="flex flex-1 flex-col gap-y-2 p-2">
                {/*PRICING SEGMENT*/}
                <div className="flex items-center gap-x-2">
                    <p className="text-sm font-bold text-[#414141] md:text-lg">
                        {formatPrice(product.effectivePrice)} ₸
                    </p>

                    {hasDiscount && (
                        <del className="text-xs text-[#bfbfbf]">
                            {formatPrice(product.regularPrice)} ₸
                        </del>
                    )}
                </div>

                {/*TITLE SEGMENT*/}
                <h3 className="line-clamp-3 min-h-10 text-sm leading-tight text-[#414141] md:min-h-13.5 md:text-base">
                    <Link
                        className="hover:underline"
                        href={href}
                    >
                        {product.title}
                    </Link>
                </h3>

                <footer className="mt-auto flex flex-col gap-2">
                    {/*RATING SEGMENT*/}
                    <div className="flex items-center gap-2">
                        <StarRating rating={product.ratingRate} />
                        <span className="text-gray-400">
                            ({product.ratingCount})
                        </span>
                    </div>

                    {/*ACTIONS SEGMENT*/}
                    <CartButton product={product} />
                </footer>
            </div>
        </article>
    );
}

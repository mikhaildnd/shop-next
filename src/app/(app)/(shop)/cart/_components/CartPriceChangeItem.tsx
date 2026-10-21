import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { CartItemData } from '@/lib/cart/cart.types';
import { cn } from '@/lib/cn';
import { formatMeasureValue } from '@/lib/format-measure-value';
import { formatPrice } from '@/lib/format-price';
import { routes } from '@/routes';

interface CartPriceChangeItemProps {
    item: CartItemData;
}

export function CartPriceChangeItem({ item }: CartPriceChangeItemProps) {
    const actualPrice = formatPrice(item.product.effectivePrice);
    const oldPrice = formatPrice(item.snapshot.effectivePrice);

    const hasDiscount = item.product.discountPercent > 0;

    const measure = formatMeasureValue(
        item.product.measureValue,
        item.product.measureType,
    );

    return (
        <div className="flex gap-2 py-3">
            <ChangedPriceImage
                imageUrl={item.product.imageUrl}
                imageAlt={item.product.title}
            />

            <div className="flex flex-col gap-y-0.5">
                <div className="flex flex-col gap-y-0.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-base leading-none font-bold break-all text-[#414141]">
                            {actualPrice} ₸
                        </p>

                        {hasDiscount && (
                            <div className="rounded-lg bg-[#ff6633] px-2 py-0.5 text-xs text-white">
                                -{item.product.discountPercent}%
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-amber-800 line-through">
                        {oldPrice} ₸
                    </p>
                </div>

                <Link
                    href={routes.productPage(item.product.slug)}
                    className="line-clamp-3 text-sm leading-tight text-[#414141] hover:text-(--color-primary) hover:underline md:text-base"
                >
                    {item.product.title}
                </Link>

                <span className="text-xs leading-none text-gray-500">
                    1 товар • {measure}
                </span>
            </div>
        </div>
    );
}

interface ChangedPriceImageProps {
    imageUrl?: string | null;
    imageAlt?: string;
    className?: string;
}

function ChangedPriceImage({
    imageUrl,
    imageAlt,
    className,
}: ChangedPriceImageProps) {
    return (
        <div
            className={cn(
                'relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-50',
                className,
            )}
        >
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={imageAlt ?? ''}
                    fill
                    className="object-cover"
                    sizes="56px"
                />
            ) : (
                <ImageOff
                    aria-hidden="true"
                    className="size-10 text-gray-300"
                />
            )}
        </div>
    );
}

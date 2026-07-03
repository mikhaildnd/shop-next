import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/lib/routes';
import type { ProductDto } from '@/services/product/product.types';
import { formatPrice } from '@/utils/formatPrice';

interface SearchProductItemProps {
    product: ProductDto;
    onClose: () => void;
}

export function SearchProductItem({
    product,
    onClose,
}: SearchProductItemProps) {
    const hasDiscount = product.discountPercent > 0;

    const image = product.images[0];

    return (
        <li>
            <Link
                onClick={onClose}
                href={routes.productPage(product.slug)}
                className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-50"
            >
                <div className="relative size-14 shrink-0 overflow-hidden rounded border border-gray-100">
                    {image && (
                        <Image
                            src={image.url}
                            alt={image.alt ?? ''}
                            fill
                            sizes="56px"
                            className="object-cover"
                        />
                    )}
                </div>

                <div className="min-w-0 grow">
                    <p className="line-clamp-2 text-sm">{product.title}</p>

                    <div className="mt-1 flex items-center gap-2">
                        <span className="font-semibold text-[#414141]">
                            {formatPrice(product.effectivePrice)} ₸
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(product.regularPrice)} ₸
                                </span>

                                <span className="rounded bg-[#ff6633] px-1.5 py-0.5 text-[10px] font-medium text-white">
                                    -{product.discountPercent}%
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </li>
    );
}

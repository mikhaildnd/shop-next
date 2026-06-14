import Image from 'next/image';
import { formatPrice } from '@/utils/formatPrice';
import StarRating from '@/components/shared/StarRating';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { ProductDto } from '@/services/product/product.types';

type ProductCardProps = {
    product: ProductDto;
    href: string;
};

const ProductCard = ({ product, href }: ProductCardProps) => {
    const hasDiscount = product.discountPercent > 0;

    //TODO сделать фолбек изображения
    const mainImage = product.images[0];

    return (
        <article className="flex h-full w-full flex-col overflow-hidden rounded bg-white">
            {/*MEDIA SECTION*/}
            <div className="relative aspect-square w-full">
                <Link
                    href={href}
                    className="absolute inset-0"
                >
                    {mainImage && (
                        <Image
                            src={mainImage.url}
                            alt={mainImage.alt ?? product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 160px, (max-width: 1280px) 224px, 272px"
                        />
                    )}
                </Link>

                {/*FAVORITE BUTTON*/}
                <button
                    aria-label="В избранное"
                    className="group absolute top-2 right-2 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white opacity-80"
                >
                    <Heart className="size-5.5 fill-transparent stroke-[1.5px] transition-[fill] duration-150 group-hover:fill-black" />
                </button>

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
                        <p className="text-[8px] text-[#bfbfbf] line-through md:text-xs">
                            {formatPrice(product.regularPrice)} ₸
                        </p>
                    )}
                </div>

                {/*TITLE SEGMENT*/}
                <h3 className="line-clamp-2 min-h-10 text-sm leading-tight text-[#414141] md:min-h-13.5 md:text-base">
                    <Link
                        className="hover:underline"
                        href={href}
                    >
                        {product.title}
                    </Link>
                </h3>

                {/*RATING SEGMENT*/}
                <div className="flex items-center gap-x-2">
                    <StarRating rating={product.ratingRate} />
                    <span className="text-gray-400">
                        ({product.ratingCount})
                    </span>
                </div>

                {/*ACTIONS SEGMENT*/}
                <button className="mt-auto flex h-10 w-full cursor-pointer items-center justify-center rounded border border-(--color-primary) p-2 text-(--color-primary) transition-all duration-300 select-none hover:border-transparent hover:bg-[#ff6633] hover:text-white active:shadow-(--shadow-button-active)">
                    В корзину
                </button>
            </div>
        </article>
    );
};

export default ProductCard;

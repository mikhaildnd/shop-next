import Image from 'next/image';
import type { ProductDto } from '@/types/product';
import IconHeart from '../../../../public/icons-header/icon-heart.svg';
import { formatPrice } from '@/utils/formatPrice';
import StarRating from '@/components/StarRating';
import { getProductPricing } from '@/lib/productPricing';

type ProductCardProps = {
    product: ProductDto;
};

const ProductCard = ({ product }: ProductCardProps) => {
    const { title, images, ratingRate, ratingCount, discountPercent } = product;

    const { regularPrice, discountedPrice, hasDiscount } =
        getProductPricing(product);

    const regularPriceClassnames = hasDiscount
        ? 'text-xs text-[#606060] line-through md:text-base'
        : 'text-sm font-bold text-[#414141] md:text-lg';

    //TODO сделать фолбек изображения
    const mainImage = images[0];

    return (
        <article className="flex h-full w-full flex-col overflow-hidden rounded bg-white">
            {/*MEDIA SECTION*/}
            <div className="relative aspect-square w-full">
                {mainImage && (
                    <Image
                        src={mainImage.url}
                        alt={mainImage.alt ?? title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 160px, (max-width: 1280px) 224px, 272px"
                    />
                )}
                <button className="absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-[#f3f2f1] opacity-50 transition-colors duration-300 hover:bg-[#fcd5ba]">
                    <IconHeart
                        aria-label="В избранное"
                        className="size-4.5"
                    />
                </button>
                {hasDiscount && (
                    <div className="absolute bottom-2.5 left-2.5 rounded bg-[#ff6633] px-2 py-1 text-white">
                        -{discountPercent}%
                    </div>
                )}
            </div>

            {/*CONTENT SECTION*/}
            <div className="flex flex-1 flex-col gap-y-2 p-2">
                {/*PRICING SEGMENT*/}
                <div className="flex items-center justify-between gap-x-2">
                    {hasDiscount && (
                        <div className="flex flex-col">
                            <p className="text-sm font-bold text-[#414141] md:text-lg">
                                {formatPrice(discountedPrice)}₽
                            </p>
                            <p className="text-[8px] text-[#bfbfbf] md:text-xs">
                                Со скидкой
                            </p>
                        </div>
                    )}
                    <p className={regularPriceClassnames}>
                        {formatPrice(regularPrice)}₽
                    </p>
                </div>

                {/*TITLE SEGMENT*/}
                <h3 className="line-clamp-2 min-h-10 text-sm leading-tight text-[#414141] md:min-h-13.5 md:text-base">
                    {title}
                </h3>

                {/*RATING SEGMENT*/}
                <div className="flex items-center gap-x-2">
                    <StarRating rating={ratingRate} />
                    <span className="text-gray-400">({ratingCount})</span>
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

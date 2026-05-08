import Image from 'next/image';
import type { ProductCardProps } from '@/types/product';
import iconHeart from '../../../../public/icons-header/icon-heart.svg';
import { formatPrice } from '@/utils/formatPrice';
import StarRating from '@/components/StarRating';

const cardDiscountPercent = 6;

const ProductCard = ({
    img,
    description,
    basePrice,
    discountPercent = 0,
    rating,
    categories,
}: ProductCardProps) => {
    const calculateFinalPrice = (price: number, discount: number): number => {
        return discount > 0 ? price * (1 - discount / 100) : price;
    };

    const calculatePriceByCard = (price: number, discount: number): number => {
        return calculateFinalPrice(price, discount);
    };

    const isNewProduct = categories?.includes('new');

    const finalPrice = isNewProduct
        ? basePrice
        : calculateFinalPrice(basePrice, discountPercent);

    const priceByCard = isNewProduct
        ? basePrice
        : calculatePriceByCard(finalPrice, cardDiscountPercent);

    return (
        <div className="flex flex-col overflow-hidden rounded bg-white p-0 align-top">
            <div className="relative aspect-square w-full">
                <Image
                    src={img}
                    alt="Акция"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, (max-width: 1280px) 224px, 272px"
                />
                <button className="absolute top-2 right-2 h-8 w-8 cursor-pointer rounded bg-[#f3f2f1] p-2 opacity-50 duration-300 hover:bg-[#fcd5ba]">
                    <Image
                        src={iconHeart}
                        alt="В избранное"
                        width={24}
                        height={24}
                        sizes="24px"
                    />
                </button>
                {discountPercent > 0 && (
                    <div className="absolute bottom-2.5 left-2.5 rounded bg-[#ff6633] px-2 py-1 text-white">
                        -{discountPercent}%
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-between gap-y-2 p-2">
                <div className="flex flex-row items-end justify-between">
                    <div className="flex flex-col gap-x-1">
                        <div className="flex flex-row gap-x-1 text-sm font-bold text-[#414141] md:text-lg">
                            <span>{formatPrice(priceByCard)}</span>
                            <span>₽</span>
                        </div>
                        {discountPercent > 0 && (
                            <p className="text-[8px] text-[#bfbfbf] md:text-xs">
                                С картой
                            </p>
                        )}
                    </div>
                    {finalPrice !== basePrice && cardDiscountPercent > 0 && (
                        <div className="flex flex-col gap-x-1">
                            <div className="flex flex-row gap-x-1 text-xs text-[#606060] md:text-base">
                                <span>{formatPrice(finalPrice)}</span>
                                <span>₽</span>
                            </div>
                            <p className="text-right text-[8px] text-[#bfbfbf] md:text-xs">
                                Обычная
                            </p>
                        </div>
                    )}
                </div>
                <p className="line-clamp-2 h-10 text-sm leading-tight text-[#414141] md:h-13.5 md:text-base">
                    {description}
                </p>
                {rating > 0 && <StarRating rating={rating} />}
                <button className="h-10 w-full cursor-pointer items-center justify-center rounded border border-(--color-primary) p-2 text-(--color-primary) transition-all duration-300 select-none hover:border-transparent hover:bg-[#ff6633] hover:text-white active:shadow-(--shadow-button-active)">
                    В корзину
                </button>
            </div>
        </div>
    );
};

export default ProductCard;

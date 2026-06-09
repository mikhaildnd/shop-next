import StarRating from '@/components/shared/StarRating';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/formatPrice';
import { getProductPricing } from '@/lib/productPricing';
import { ProductDto } from '@/services/product/product.types';

interface ProductInfoCardProps {
    product: ProductDto;
    className?: string;
}

const ProductInfoCard = ({ product, className }: ProductInfoCardProps) => {
    const { regularPrice, discountedPrice, hasDiscount } =
        getProductPricing(product);

    const regularPriceClassnames = hasDiscount
        ? 'text-[#606060] line-through'
        : 'font-bold text-[#414141]';

    return (
        <section
            className={cn(
                'flex flex-col gap-y-6 rounded-b-3xl bg-white px-(--section-padding) py-6 shadow-[0_4px_24px_-1px_rgba(0,0,0,.071)] md:gap-y-10 md:rounded-3xl md:px-6',
                className,
            )}
        >
            <div>
                <h1 className="text-2xl font-bold">{product.title}</h1>

                <div className="flex items-center gap-x-2">
                    <StarRating rating={product.ratingRate} />
                    <span className="text-gray-400">
                        ({product.ratingCount})
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-y-1">
                <div className="flex flex-row items-center gap-x-2">
                    <p className={cn(regularPriceClassnames, 'text-md')}>
                        {formatPrice(regularPrice)} ₸
                    </p>
                    {hasDiscount && (
                        <div className="rounded-sm bg-[#ff6633] px-2 py-1 text-sm text-white">
                            -{product.discountPercent}%
                        </div>
                    )}
                </div>

                {hasDiscount && (
                    <div className="flex flex-col">
                        <p className="text-2xl font-bold text-[#414141]">
                            {formatPrice(discountedPrice)} ₸
                        </p>
                        {/*<p className="text-[8px] text-[#bfbfbf] md:text-xs">*/}
                        {/*    Со скидкой*/}
                        {/*</p>*/}
                    </div>
                )}
            </div>

            <button className="flex h-10 w-full cursor-pointer items-center justify-center rounded border border-(--color-primary) p-2 text-(--color-primary) transition-all duration-300 select-none hover:border-transparent hover:bg-[#ff6633] hover:text-white active:shadow-(--shadow-button-active)">
                В корзину
            </button>
        </section>
    );
};

export default ProductInfoCard;

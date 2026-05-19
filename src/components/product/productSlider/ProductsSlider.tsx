'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import clsx from 'clsx';
import type { ProductDto } from '@/types/product';
import 'swiper/css';
import type { Swiper as SwiperType } from 'swiper';
import { PRODUCTS_SLIDER_CONFIG } from '@/consts/productsSliderSettings';
import ProductCard from '@/components/product/productCard/ProductCard';

interface ProductsSliderProps {
    onSwiper?: (swiper: SwiperType) => void;
    onReady?: () => void;
    products: ProductDto[];
    className?: string;
}

const MOBILE_PEEK_STYLES = '!overflow-visible lg:!overflow-hidden';

const ProductsSlider = ({
    className,
    products,
    onSwiper,
    onReady,
}: ProductsSliderProps) => {
    return (
        <Swiper
            onAfterInit={onReady}
            onSwiper={onSwiper}
            breakpoints={PRODUCTS_SLIDER_CONFIG}
            className={clsx(className, 'w-full', MOBILE_PEEK_STYLES)}
        >
            {products.map((product) => (
                <SwiperSlide
                    className="!h-auto"
                    key={product.id}
                >
                    <ProductCard product={product} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ProductsSlider;

'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import type { Swiper as SwiperType } from 'swiper';
import { PRODUCTS_SLIDER_CONFIG } from '@/consts/productsSliderSettings';
import ProductCard from '@/components/product/productCard/ProductCard';
import { routes } from '@/lib/routes';
import { cn } from '@/utils/cn';
import type { ProductDto } from '@/services/product/product.types';

interface ProductsSliderProps {
    onSwiper?: (swiper: SwiperType) => void;
    onReady?: () => void;
    products: ProductDto[];
    className?: string;
}

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
            className={cn(className, 'w-full')}
        >
            {products.map((product) => (
                <SwiperSlide
                    className="!h-auto"
                    key={product.id}
                >
                    <ProductCard
                        product={product}
                        href={routes.product(product.slug)}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ProductsSlider;

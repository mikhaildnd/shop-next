'use client';

import 'swiper/css';

import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ProductCard } from '@/components/product/product-card/ProductCard';
import { PRODUCTS_SLIDER_CONFIG } from '@/components/product/product-slider/products-slider.constants';
import { cn } from '@/lib/cn';
import { routes } from '@/routes';
import type { ProductDto } from '@/services/product/product.types';

interface ProductsSliderProps {
    onSwiper?: (swiper: SwiperType) => void;
    onReady?: () => void;
    products: ProductDto[];
    className?: string;
}

export function ProductsSlider({
    className,
    products,
    onSwiper,
    onReady,
}: ProductsSliderProps) {
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
                        href={routes.productPage(product.slug)}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

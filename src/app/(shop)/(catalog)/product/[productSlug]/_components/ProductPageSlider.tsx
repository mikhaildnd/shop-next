'use client';

import 'swiper/css';

import Image from 'next/image';
import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { SliderNavigationButton } from '@/components/shared/slider/SliderNavigationButton';
import { SliderPagination } from '@/components/shared/slider/SliderPagination';
import { useSliderNavigation } from '@/hooks/useSliderNavigation';
import type { ProductImageDto } from '@/services/product/product.types';
import { cn } from '@/utils/cn';

interface ProductPageSliderProps {
    slides: ProductImageDto[];
    className?: string;
}

export function ProductPageSlider({
    slides,
    className,
}: ProductPageSliderProps) {
    const [swiper, setSwiper] = useState<SwiperType | null>(null);
    const { prevSlide, nextSlide } = useSliderNavigation(swiper);

    return (
        <div>
            <Swiper
                onSwiper={setSwiper}
                className={cn(className, 'relative')}
                loop
            >
                {slides.length > 1 && (
                    <>
                        <div className="absolute inset-0 hidden md:flex">
                            <SliderNavigationButton
                                className="right-4"
                                direction="prev"
                                onClick={prevSlide}
                            />
                            <SliderNavigationButton
                                className="left-4"
                                direction="next"
                                onClick={nextSlide}
                            />
                        </div>

                        <SliderPagination
                            className="absolute bottom-6 left-1/2 z-5 -translate-x-1/2"
                            totalSlides={slides.length}
                        />
                    </>
                )}
                {slides.map((slide) => {
                    const { url, alt } = slide;

                    return (
                        <SwiperSlide
                            key={url}
                            className="relative aspect-square bg-gray-300"
                        >
                            {/*<div className="relative h-full bg-gray-300">*/}
                            <Image
                                fill
                                className="object-contain"
                                src={url}
                                alt={alt ?? ''}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/*</div>*/}
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}

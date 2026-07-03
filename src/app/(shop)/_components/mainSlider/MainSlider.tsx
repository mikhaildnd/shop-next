'use client';

import 'swiper/css';
import 'swiper/css/effect-fade';

import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, type SwiperProps,SwiperSlide } from 'swiper/react';

import { Slide } from '@/app/(shop)/_components/mainSlider/Slide';
import { SliderNavigationButton } from '@/components/shared/slider/SliderNavigationButton';
import { SliderPagination } from '@/components/shared/slider/SliderPagination';
import { useSliderNavigation } from '@/hooks/useSliderNavigation';
import type { MainSlideData } from '@/types/mainSlideData';
import { cn } from '@/utils/cn';

interface MainSliderProps {
    slides: MainSlideData[];
    autoplay?: SwiperProps['autoplay'];
    className?: string;
}

export function MainSlider({ slides, className, autoplay }: MainSliderProps) {
    const [swiper, setSwiper] = useState<SwiperType | null>(null);
    const { prevSlide, nextSlide } = useSliderNavigation(swiper);

    return (
        <Swiper
            onSwiper={setSwiper}
            className={cn(className, 'relative')}
            modules={[Autoplay, EffectFade]}
            autoplay={autoplay}
            effect="fade"
            loop
        >
            {slides.length > 1 && (
                <>
                    <div className="absolute inset-0 hidden md:flex">
                        <SliderNavigationButton
                            direction="prev"
                            onClick={prevSlide}
                        />
                        <SliderNavigationButton
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
                const { id, image, link, slideText } = slide;

                return (
                    <SwiperSlide key={id}>
                        <Slide
                            image={image}
                            link={link}
                            slideText={slideText}
                        />
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}

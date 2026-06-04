'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide, type SwiperProps } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { useSliderNavigation } from '@/hooks/useSliderNavigation';
import type { MainSlideData } from '@/types/mainSlideData';
import SliderNavigationButton from '@/components/shared/slider/SliderNavigationButton';
import SliderPagination from '@/components/shared/slider/SliderPagination';
import Slide from '@/components/mainSlider/Slide';
import clsx from 'clsx';

interface MainSliderProps {
    slides: MainSlideData[];
    autoplay?: SwiperProps['autoplay'];
    className?: string;
}

const MainSlider = ({ slides, className, autoplay }: MainSliderProps) => {
    const [swiper, setSwiper] = useState<SwiperType | null>(null);
    const { prevSlide, nextSlide } = useSliderNavigation(swiper);

    return (
        <Swiper
            onSwiper={setSwiper}
            className={clsx(className, 'relative')}
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
};

export default MainSlider;

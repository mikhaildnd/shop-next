import type { Swiper as SwiperType } from 'swiper';

export const useSliderNavigation = (swiper: SwiperType | null) => {
    const prevSlide = () => swiper?.slidePrev();
    const nextSlide = () => swiper?.slideNext();

    return { prevSlide, nextSlide };
};

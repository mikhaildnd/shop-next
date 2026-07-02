import type { Swiper as SwiperType } from 'swiper';

export function useSliderNavigation(swiper: SwiperType | null) {
    const prevSlide = () => swiper?.slidePrev();
    const nextSlide = () => swiper?.slideNext();

    return { prevSlide, nextSlide };
}

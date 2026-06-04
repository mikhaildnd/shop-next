export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

export const PRODUCTS_SLIDER_CONFIG = {
    0: {
        slidesPerView: 2.2,
        slidesPerGroup: 2,
        spaceBetween: 8,
    },
    [BREAKPOINTS.sm]: {
        slidesPerView: 3.2,
        slidesPerGroup: 3,
        spaceBetween: 12,
    },
    [BREAKPOINTS.lg]: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 16,
    },
};

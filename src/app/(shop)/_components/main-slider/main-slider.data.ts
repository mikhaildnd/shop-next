import type { MainSlideData } from '@/app/(shop)/_components/main-slider/main-slider.types';

import OfferImage1 from '../../../../../public/images/banners/akciya_1.webp';
import OfferImage2 from '../../../../../public/images/banners/akciya_2.webp';

export const slides: MainSlideData[] = [
    {
        id: '1',
        link: {
            href: '/',
        },
        image: {
            src: OfferImage1,
            alt: '',
            quality: 80,
        },
        slideText: {
            title: 'Заголовок',
            description: 'Описание',
        },
    },
    {
        id: '2',
        link: {
            href: '/',
        },
        image: {
            src: OfferImage2,
            alt: '',
            quality: 80,
        },
        slideText: {
            title: 'Заголовок',
            description: 'Описание',
        },
    },
];

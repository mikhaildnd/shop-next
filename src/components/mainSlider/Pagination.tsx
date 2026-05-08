'use client';

import { useSwiper } from 'swiper/react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import PaginationBullet from '@/components/mainSlider/PaginationBullet';

interface PaginationProps {
    totalSlides: number;
    className?: string;
}

const Pagination = ({ totalSlides, className }: PaginationProps) => {
    const swiper = useSwiper();
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!swiper) return;

        const handleChange = () => {
            setActiveIndex(swiper.realIndex);
        };

        handleChange();

        swiper.on('slideChange', handleChange);

        return () => {
            swiper.off('slideChange', handleChange);
        };
    }, [swiper]);

    if (!swiper) return null;

    return (
        <div className={clsx('flex justify-center gap-1.5', className)}>
            {Array.from({ length: totalSlides }).map((_, idx) => {
                const isActive = idx === activeIndex;
                return (
                    <PaginationBullet
                        key={idx}
                        isActive={isActive}
                        onClick={() => swiper.slideToLoop(idx)}
                    />
                );
            })}
        </div>
    );
};

export default Pagination;

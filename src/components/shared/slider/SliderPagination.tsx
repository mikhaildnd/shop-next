'use client';

import { useSwiper } from 'swiper/react';
import { useEffect, useState } from 'react';
import SliderPaginationBullet from '@/components/shared/slider/SliderPaginationBullet';
import { cn } from '@/utils/cn';

interface SliderPaginationProps {
    totalSlides: number;
    className?: string;
}

const SliderPagination = ({
    totalSlides,
    className,
}: SliderPaginationProps) => {
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
        <div className={cn('flex justify-center gap-1.5', className)}>
            {Array.from({ length: totalSlides }).map((_, idx) => {
                const isActive = idx === activeIndex;
                return (
                    <SliderPaginationBullet
                        key={idx}
                        isActive={isActive}
                        onClick={() => swiper.slideToLoop(idx)}
                    />
                );
            })}
        </div>
    );
};

export default SliderPagination;

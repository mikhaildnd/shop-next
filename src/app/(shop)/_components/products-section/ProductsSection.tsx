'use client';

import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';

import { ProductsSectionControls } from '@/app/(shop)/_components/products-section/ProductsSectionControls';
import { ProductsSectionHeader } from '@/app/(shop)/_components/products-section/ProductsSectionHeader';
import { ProductsSliderLazy } from '@/components/product/product-slider/ProductsSlider.lazy';
import { useSliderNavigation } from '@/hooks/useSliderNavigation';
import { cn } from '@/lib/cn';
import type { ProductDto } from '@/services/product/product.types';

interface ProductSectionProps {
    title: string;
    link: string;
    products: ProductDto[];
}

const CONTENT_HEIGHT = 'min-h-[260px] sm:min-h-[300px] lg:min-h-[400px]';

export function ProductsSection({
    title,
    link,
    products,
}: ProductSectionProps) {
    const [swiper, setSwiper] = useState<SwiperType | null>(null);
    const [isReady, setIsReady] = useState(false);

    const { prevSlide, nextSlide } = useSliderNavigation(swiper);

    const hasProducts = products.length > 0;

    return (
        <section className="flex flex-col">
            <ProductsSectionHeader
                title={title}
                link={link}
                showLink={hasProducts}
            >
                {hasProducts && (
                    <ProductsSectionControls
                        disabled={!isReady}
                        onPrev={prevSlide}
                        onNext={nextSlide}
                    />
                )}
            </ProductsSectionHeader>

            {hasProducts ? (
                <div
                    className={cn(
                        '-mr-(--section-padding) lg:mr-0',
                        CONTENT_HEIGHT,
                    )}
                >
                    <ProductsSliderLazy
                        products={products}
                        onSwiper={setSwiper}
                        onReady={() => setIsReady(true)}
                    />
                </div>
            ) : (
                <div
                    className={cn(
                        'flex items-center justify-center rounded-2xl bg-[#f8f8f8] text-sm text-gray-500',
                        CONTENT_HEIGHT,
                    )}
                >
                    Товары не найдены
                </div>
            )}
        </section>
    );
}

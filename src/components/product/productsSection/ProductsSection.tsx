'use client';

import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';

import { ProductsSliderLazy } from '@/components/product/productSlider/ProductsSlider.lazy';
import { ProductsSectionControls } from '@/components/product/productsSection/ProductsSectionControls';
import { ProductsSectionHeader } from '@/components/product/productsSection/ProductsSectionHeader';
import { useSliderNavigation } from '@/hooks/useSliderNavigation';
import type { ProductDto } from '@/services/product/product.types';
import { cn } from '@/utils/cn';

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

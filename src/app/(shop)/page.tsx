import { Suspense } from 'react';

import { BannerSpecialOffers } from '@/app/(shop)/_components/banners/BannerSpecialOffers';
import { slides } from '@/app/(shop)/_components/main-slider/main-slider.data';
import { MainSlider } from '@/app/(shop)/_components/main-slider/MainSlider';
import { MapsLazy } from '@/app/(shop)/_components/maps/Maps.lazy';
import { ProductsSectionSkeleton } from '@/app/(shop)/_components/products-section/ProductsSectionSkeleton';
import { ProductsNewSection } from '@/app/(shop)/_components/ProductsNewSection';
import { ProductsOfferSection } from '@/app/(shop)/_components/ProductsOfferSection';
import { LazySection } from '@/components/wrappers/LazySection';

export default async function HomePage() {
    return (
        <div className="page-spacing flex flex-col gap-y-10 md:mt-6 md:gap-y-20 lg:mt-10">
            <div className="-mx-(--section-padding) md:mx-0">
                <MainSlider
                    className="h-[500px] w-full rounded-b-3xl md:rounded-3xl xl:h-[680px]"
                    slides={slides}
                    autoplay={{
                        delay: 10000,
                    }}
                />
            </div>
            <Suspense fallback={<ProductsSectionSkeleton />}>
                <ProductsOfferSection />
            </Suspense>
            <Suspense fallback={<ProductsSectionSkeleton />}>
                <ProductsNewSection />
            </Suspense>
            <BannerSpecialOffers />
            <LazySection>
                <MapsLazy />
            </LazySection>
        </div>
    );
}

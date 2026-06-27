import MainSlider from '@/app/(shop)/_components/mainSlider/MainSlider';
import ProductsOfferSection from '@/app/(shop)/_components/ProductsOfferSection';
import ProductsNewSection from '@/app/(shop)/_components/ProductsNewSection';
import BannerSpecialOffers from '@/components/banners/BannerSpecialOffers';
import { Suspense } from 'react';
import ProductsSectionSkeleton from '@/components/product/productsSection/ProductsSectionSkeleton';
import LazySection from '@/components/shared/LazySection';
import Maps from '@/components/maps/Maps.lazy';
import { slides } from '@/data/mainSlides';

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
            <LazySection>
                <Suspense fallback={<ProductsSectionSkeleton />}>
                    <ProductsNewSection />
                </Suspense>
            </LazySection>
            <BannerSpecialOffers />
            <LazySection>
                <Maps />
            </LazySection>
        </div>
    );
}

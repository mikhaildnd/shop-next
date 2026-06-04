import MainSlider from '@/components/mainSlider/MainSlider';
import ProductsOfferSection from '@/app/_components/ProductsOfferSection';
import ProductsNewSection from '@/app/_components/ProductsNewSection';
import ProductsBoughtBeforeSection from '@/app/_components/ProductsBoughtBeforeSection';
import BannerSpecialOffers from '@/components/banners/BannerSpecialOffers';
import { Suspense } from 'react';
import ProductsSectionSkeleton from '@/components/product/productsSection/ProductsSectionSkeleton';
import LazySection from '@/components/shared/LazySection';
import Maps from '@/components/maps/Maps.lazy';
import { slides } from '@/data/mainSlides';

//TODO добавить метаданные на все страницы
export default async function Page() {
    return (
        <div className="page-spacing flex flex-col gap-y-10 md:gap-y-20">
            <div className="-mx-(--section-padding) md:mx-0">
                <MainSlider
                    className="h-[500px] w-full rounded-b-3xl md:rounded-3xl xl:h-[680px]"
                    slides={slides}
                    // autoplay={{
                    //     delay: 10000,
                    // }}
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
            <LazySection>
                <Suspense fallback={<ProductsSectionSkeleton />}>
                    <ProductsBoughtBeforeSection />
                </Suspense>
            </LazySection>
            <BannerSpecialOffers />
            <LazySection>
                <Maps />
            </LazySection>
        </div>
    );
}

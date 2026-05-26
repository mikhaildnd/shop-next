import MainSlider from '@/components/mainSlider/MainSlider';
import ProductsOffer from '@/components/product/ProductsOffer';
import ProductsNew from '@/components/product/ProductsNew';
import ProductsBoughtBefore from '@/components/product/ProductsBoughtBefore';
import BannerSpecialOffers from '@/components/banners/BannerSpecialOffers';
import { Suspense } from 'react';
import ProductsSectionSkeleton from '@/components/product/productsSection/ProductsSectionSkeleton';
import LazySection from '@/components/shared/LazySection';
import Maps from '@/components/maps/Maps.lazy';
import { slides } from '@/data/mainSlides';

//TODO добавить метаданные на все страницы
export default async function Page() {
    return (
        <>
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
                <ProductsOffer />
            </Suspense>
            <LazySection>
                <Suspense fallback={<ProductsSectionSkeleton />}>
                    <ProductsNew />
                </Suspense>
            </LazySection>
            <LazySection>
                <Suspense fallback={<ProductsSectionSkeleton />}>
                    <ProductsBoughtBefore />
                </Suspense>
            </LazySection>
            <BannerSpecialOffers />
            <LazySection>
                <Maps />
            </LazySection>
        </>
    );
}

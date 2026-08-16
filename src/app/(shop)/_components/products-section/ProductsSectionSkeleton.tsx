import { ProductsSectionHeaderSkeleton } from '@/app/(shop)/_components/products-section/ProductsSectionHeaderSkeleton';
import { ProductsSliderSkeleton } from '@/components/product/product-slider/ProductsSliderSkeleton';

export function ProductsSectionSkeleton() {
    return (
        <section className="flex flex-col">
            <ProductsSectionHeaderSkeleton />

            <div className="min-h-[260px] sm:min-h-[300px] lg:min-h-[400px]">
                <ProductsSliderSkeleton />
            </div>
        </section>
    );
}

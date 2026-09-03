import { ProductsSectionHeaderSkeleton } from '@/app/(shop)/_components/products-section/ProductsSectionHeaderSkeleton';
import { ProductsSliderSkeleton } from '@/components/product/product-slider/ProductsSliderSkeleton';
import { cn } from '@/lib/cn';

const CONTENT_HEIGHT = 'min-h-[260px] sm:min-h-[300px] lg:min-h-[400px]';

export function ProductsSectionSkeleton() {
    return (
        <section className="flex flex-col">
            <ProductsSectionHeaderSkeleton />

            <div
                className={cn(
                    '-mx-(--section-padding) lg:mx-0',
                    CONTENT_HEIGHT,
                )}
            >
                <ProductsSliderSkeleton />
            </div>
        </section>
    );
}

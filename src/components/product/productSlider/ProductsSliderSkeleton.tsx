import { ProductCardSkeleton } from '@/components/product/productCard/ProductCardSkeleton';

export function ProductsSliderSkeleton() {
    return (
        <div className="overflow-hidden">
            <div className="flex gap-2 sm:gap-3 lg:gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="shrink-0 basis-[calc((100%-8px)/2.2)] sm:basis-[calc((100%-24px)/3.2)] lg:basis-[calc((100%-48px)/4)]"
                    >
                        <ProductCardSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
}

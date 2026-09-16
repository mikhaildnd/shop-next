import { ProductDesktopFiltersSkeleton } from '@/app/(shop)/(catalog)/_components/product-filters/ProductDesktopFiltersSkeleton';
import { ProductMobileFiltersSkeleton } from '@/app/(shop)/(catalog)/_components/product-filters/ProductMobileFiltersSkeleton';
import { ProductGridSkeleton } from '@/app/(shop)/(catalog)/_components/ProductGridSkeleton';

export function ProductListingSkeleton() {
    return (
        <div className="grid items-start lg:grid-cols-[280px_1fr] lg:gap-4">
            <ProductDesktopFiltersSkeleton className="hidden lg:flex" />

            <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                    <div className="h-10 w-54 animate-pulse rounded-xl bg-gray-200" />

                    <ProductMobileFiltersSkeleton className="lg:hidden" />
                </div>

                <ProductGridSkeleton />
            </div>
        </div>
    );
}

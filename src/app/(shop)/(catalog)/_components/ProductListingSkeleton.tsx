import { ProductSortDropdown } from '@/app/(shop)/(catalog)/_components/product-filters/product-sort-dropdown/ProductSortDropdown';
import { ProductDesktopFiltersSkeleton } from '@/app/(shop)/(catalog)/_components/product-filters/ProductDesktopFiltersSkeleton';
import { ProductMobileFiltersSkeleton } from '@/app/(shop)/(catalog)/_components/product-filters/ProductMobileFiltersSkeleton';
import { ProductGridSkeleton } from '@/app/(shop)/(catalog)/_components/ProductGridSkeleton';
import type { ProductSort } from '@/services/product/sort/sort.types';

interface ProductListingSkeletonProps {
    sort: ProductSort;
}

export function ProductListingSkeleton({ sort }: ProductListingSkeletonProps) {
    return (
        <div className="grid items-start lg:grid-cols-[280px_1fr] lg:gap-4">
            <ProductDesktopFiltersSkeleton className="hidden lg:flex" />

            <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                    <ProductSortDropdown value={sort} />

                    <ProductMobileFiltersSkeleton className="lg:hidden" />
                </div>

                <ProductGridSkeleton />
            </div>
        </div>
    );
}

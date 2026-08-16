import { ProductFiltersPanel } from '@/app/(shop)/(catalog)/_components/product-filters/ProductFiltersPanel';
import { ResetFiltersButton } from '@/app/(shop)/(catalog)/_components/product-filters/ResetFiltersButton';
import { cn } from '@/lib/cn';
import type { ProductListingStats } from '@/services/product/product.types';

interface ProductDesktopFiltersProps {
    listingStats: ProductListingStats;
    className?: string;
}

export function ProductDesktopFilters({
    listingStats,
    className,
}: ProductDesktopFiltersProps) {
    return (
        <aside
            className={cn(
                'sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col overflow-y-auto rounded-xl border border-gray-100 bg-white',
                className,
            )}
        >
            <ProductFiltersPanel listingStats={listingStats} />

            <ResetFiltersButton className="mx-auto mt-6 mb-4" />
        </aside>
    );
}

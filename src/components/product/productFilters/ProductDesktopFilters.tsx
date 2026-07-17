import { cn } from '@/utils/cn';
import { ResetFiltersButton } from '@/components/product/productFilters/ResetFiltersButton';
import type { ProductListingStats } from '@/services/product/product.types';
import { ProductFiltersPanel } from '@/components/product/productFilters/ProductFiltersPanel';

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

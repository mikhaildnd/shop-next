import { LoadMoreButton } from '@/app/(shop)/(catalog)/_components/LoadMoreButton';
import { ProductSortDropdown } from '@/app/(shop)/(catalog)/_components/product-filters/product-sort-dropdown/ProductSortDropdown';
import { ProductDesktopFilters } from '@/app/(shop)/(catalog)/_components/product-filters/ProductDesktopFilters';
import { ProductMobileFilters } from '@/app/(shop)/(catalog)/_components/product-filters/ProductMobileFilters';
import { ProductGrid } from '@/app/(shop)/(catalog)/_components/ProductGrid';
import { Pagination } from '@/components/Pagination';
import type {
    ProductListingItemDto,
    ProductListingStats,
} from '@/services/product/product.types';
import type { ProductSort } from '@/services/product/sort/sort.types';

interface ProductListingProps {
    sort: ProductSort;
    listingStats: ProductListingStats;
    products: ProductListingItemDto[];
    currentPage: number;
    totalPages: number;
    startPage: number;
}

export function ProductListing({
    sort,
    listingStats,
    products,
    currentPage,
    totalPages,
    startPage,
}: ProductListingProps) {
    const hasPagination = totalPages > 1;
    const hasMore = currentPage < totalPages;

    return (
        <div className="grid items-start lg:grid-cols-[280px_1fr] lg:gap-4">
            <ProductDesktopFilters
                listingStats={listingStats}
                className="hidden lg:flex"
            />

            <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                    <ProductSortDropdown value={sort} />

                    <ProductMobileFilters
                        className="lg:hidden"
                        listingStats={listingStats}
                    />
                </div>

                <div className="flex flex-col gap-y-6 lg:gap-y-12">
                    <ProductGrid products={products} />

                    {hasPagination && (
                        <div className="flex flex-col items-center gap-y-4 lg:gap-y-8">
                            {hasMore && (
                                <LoadMoreButton
                                    pendingText="Загрузка..."
                                    nextPage={currentPage + 1}
                                    from={startPage}
                                    className="w-full"
                                />
                            )}

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

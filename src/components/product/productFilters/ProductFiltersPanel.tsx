import { ProductDiscountFilter } from '@/components/product/productFilters/ProductDiscountFilter';
import { ProductInStockFilter } from '@/components/product/productFilters/ProductInStockFilter';
import { ProductPriceFilter } from '@/components/product/productFilters/ProductPriceFilter';
import { ProductSaleFilter } from '@/components/product/productFilters/ProductSaleFilter';
import type { ProductListingStats } from '@/services/product/product.types';

interface ProductFiltersPanelProps {
    listingStats: ProductListingStats;
    filteredProductsCount: number;
}

export function ProductFiltersPanel({
    listingStats,
}: ProductFiltersPanelProps) {
    return (
        <aside className="sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col overflow-y-auto rounded-xl border border-gray-100 bg-white">
            <ProductPriceFilter
                minPrice={listingStats.minPrice}
                maxPrice={listingStats.maxPrice}
            />
            <ProductInStockFilter />
            <ProductSaleFilter />
            <ProductDiscountFilter maxDiscount={listingStats.maxDiscount} />
        </aside>
    );
}

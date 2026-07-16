import { ProductDiscountFilter } from '@/components/product/productFilters/ProductDiscountFilter';
import { ProductInStockFilter } from '@/components/product/productFilters/ProductInStockFilter';
import { ProductPriceFilter } from '@/components/product/productFilters/ProductPriceFilter';
import { ProductSaleFilter } from '@/components/product/productFilters/ProductSaleFilter';
import type { ProductListingStats } from '@/services/product/product.types';

interface ProductFiltersPanelProps {
    listingStats: ProductListingStats;
}

export function ProductFiltersPanel({
    listingStats,
}: ProductFiltersPanelProps) {
    return (
        <div className="flex flex-col">
            <ProductPriceFilter
                minPrice={listingStats.minPrice}
                maxPrice={listingStats.maxPrice}
            />
            <ProductInStockFilter />
            <ProductSaleFilter />
            <ProductDiscountFilter maxDiscount={listingStats.maxDiscount} />
        </div>
    );
}

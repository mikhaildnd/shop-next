'use client';

import { ProductDiscountFilter } from '@/components/product/productFilters/ProductDiscountFilter';
import { ProductInStockFilter } from '@/components/product/productFilters/ProductInStockFilter';
import { ProductPriceFilter } from '@/components/product/productFilters/ProductPriceFilter';
import { ProductSaleFilter } from '@/components/product/productFilters/ProductSaleFilter';
import { useProductListing } from '@/hooks/useProductListing';
import { getProductFilterVisibility } from '@/lib/product-listing/filters/get-product-filter-visibility';
import type { ProductListingStats } from '@/services/product/product.types';

interface ProductFiltersPanelProps {
    listingStats: ProductListingStats;
}

export function ProductFiltersPanel({
    listingStats,
}: ProductFiltersPanelProps) {
    const { filters } = useProductListing();

    const filterState = getProductFilterVisibility({
        listingStats,
        filters,
    });

    return (
        <div className="flex flex-col">
            {filterState.price && (
                <ProductPriceFilter
                    minPrice={listingStats.minPrice}
                    maxPrice={listingStats.maxPrice}
                />
            )}
            {filterState.inStock && <ProductInStockFilter />}
            {filterState.sale && <ProductSaleFilter />}
            {filterState.discount && (
                <ProductDiscountFilter maxDiscount={listingStats.maxDiscount} />
            )}
        </div>
    );
}

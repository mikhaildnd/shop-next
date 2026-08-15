'use client';

import { ProductDiscountFilter } from '@/app/(shop)/(catalog)/_components/product-filters/ProductDiscountFilter';
import { ProductInStockFilter } from '@/app/(shop)/(catalog)/_components/product-filters/ProductInStockFilter';
import { ProductPriceFilter } from '@/app/(shop)/(catalog)/_components/product-filters/ProductPriceFilter';
import { ProductSaleFilter } from '@/app/(shop)/(catalog)/_components/product-filters/ProductSaleFilter';
import { useProductListing } from '@/app/(shop)/(catalog)/_hooks/useProductListing';
import { getProductFilterVisibility } from '@/app/(shop)/(catalog)/lib/product-listing/filters/get-product-filter-visibility';
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

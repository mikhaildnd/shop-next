'use client';

import { ProductDiscountFilter } from '@/app/(shop)/(catalog)/_components/product-filters/ProductDiscountFilter';
import { ProductInStockFilter } from '@/app/(shop)/(catalog)/_components/product-filters/ProductInStockFilter';
import { ProductPriceFilter } from '@/app/(shop)/(catalog)/_components/product-filters/ProductPriceFilter';
import { ProductSaleFilter } from '@/app/(shop)/(catalog)/_components/product-filters/ProductSaleFilter';
import { useProductListing } from '@/app/(shop)/(catalog)/_hooks/useProductListing';
import { getProductFilterVisibility } from '@/app/(shop)/(catalog)/lib/product-listing/filters/get-product-filter-visibility';
import type { ProductListingStats } from '@/services/product/product.types';
import { useUpdateProductListing } from '@/app/(shop)/(catalog)/_hooks/useUpdateProductListing';

interface ProductFiltersPanelProps {
    listingStats: ProductListingStats;
}

export function ProductFiltersPanel({
    listingStats,
}: ProductFiltersPanelProps) {
    const listing = useProductListing();
    const updateProductListing = useUpdateProductListing();

    const { filters } = listing;

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
                    priceFrom={filters.priceFrom}
                    priceTo={filters.priceTo}
                    onChange={(priceFrom, priceTo) =>
                        updateProductListing({
                            filters: {
                                priceFrom,
                                priceTo,
                            },
                        })
                    }
                />
            )}

            {filterState.inStock && (
                <ProductInStockFilter
                    checked={filters.inStock}
                    onChange={() =>
                        updateProductListing({
                            filters: {
                                inStock: !filters.inStock,
                            },
                        })
                    }
                />
            )}

            {filterState.sale && (
                <ProductSaleFilter
                    checked={filters.sale}
                    onChange={() =>
                        updateProductListing({
                            filters: {
                                sale: !filters.sale,
                            },
                        })
                    }
                />
            )}

            {filterState.discount && (
                <ProductDiscountFilter
                    maxDiscount={listingStats.maxDiscount}
                    value={filters.discount}
                    onChange={(value) =>
                        updateProductListing({
                            filters: {
                                discount:
                                    filters.discount === value ? null : value,
                            },
                        })
                    }
                />
            )}
        </div>
    );
}

'use client';

import { ProductDiscountFilter } from '@/app/(shop)/(catalog)/_components/product-filters/ProductDiscountFilter';
import { ProductInStockFilter } from '@/app/(shop)/(catalog)/_components/product-filters/ProductInStockFilter';
import { ProductPriceFilter } from '@/app/(shop)/(catalog)/_components/product-filters/ProductPriceFilter';
import { ProductSaleFilter } from '@/app/(shop)/(catalog)/_components/product-filters/ProductSaleFilter';
import { useProductListingContext } from '@/app/(shop)/(catalog)/_components/ProductListingContext';
import { getProductFilterVisibility } from '@/app/(shop)/(catalog)/lib/product-listing/filters/get-product-filter-visibility';

export function ProductFiltersPanel() {
    const { listing, listingStats, updateListing } = useProductListingContext();
    const { filters } = listing;

    const filterState = getProductFilterVisibility({
        listingStats,
        filters,
    });

    return (
        <div className="flex flex-col divide-y divide-gray-100 [&>*]:px-4 [&>*]:py-5">
            {filterState.price && (
                <ProductPriceFilter
                    minPrice={listingStats.minPrice}
                    maxPrice={listingStats.maxPrice}
                    priceFrom={filters.priceFrom}
                    priceTo={filters.priceTo}
                    onChange={(priceFrom, priceTo) =>
                        updateListing({
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
                        updateListing({
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
                        updateListing({
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
                        updateListing({
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

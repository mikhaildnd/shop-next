'use client';

import { FilterCheckbox } from '@/components/product/productFilters/FilterCheckbox';
import { FilterSection } from '@/components/product/productFilters/FilterSection';
import { useProductListing } from '@/hooks/useProductListing';
import { useUpdateProductListing } from '@/hooks/useUpdateProductListing';

export function ProductInStockFilter() {
    const updateProductListing = useUpdateProductListing();

    const { filters } = useProductListing();

    const handleChange = () => {
        updateProductListing({
            filters: {
                inStock: !filters.inStock,
            },
        });
    };

    return (
        <FilterSection>
            <FilterCheckbox
                id="in-stock"
                checked={filters.inStock}
                label="В наличии"
                onChange={handleChange}
            />
        </FilterSection>
    );
}

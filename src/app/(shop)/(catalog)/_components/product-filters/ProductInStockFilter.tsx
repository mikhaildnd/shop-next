'use client';

import { FilterCheckbox } from '@/app/(shop)/(catalog)/_components/product-filters/FilterCheckbox';
import { FilterSection } from '@/app/(shop)/(catalog)/_components/product-filters/FilterSection';
import { useProductListing } from '@/app/(shop)/(catalog)/_hooks/useProductListing';
import { useUpdateProductListing } from '@/app/(shop)/(catalog)/_hooks/useUpdateProductListing';

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

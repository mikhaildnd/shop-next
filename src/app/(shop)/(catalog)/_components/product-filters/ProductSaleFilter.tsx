'use client';

import { FilterCheckbox } from '@/app/(shop)/(catalog)/_components/product-filters/FilterCheckbox';
import { FilterSection } from '@/app/(shop)/(catalog)/_components/product-filters/FilterSection';
import { useProductListing } from '@/app/(shop)/(catalog)/_hooks/useProductListing';
import { useUpdateProductListing } from '@/app/(shop)/(catalog)/_hooks/useUpdateProductListing';

export function ProductSaleFilter() {
    const updateProductListing = useUpdateProductListing();

    const { filters } = useProductListing();

    const handleChange = () => {
        updateProductListing({
            filters: {
                sale: !filters.sale,
            },
        });
    };

    return (
        <FilterSection>
            <FilterCheckbox
                id="sale"
                checked={filters.sale}
                label="Только со скидкой"
                onChange={handleChange}
            />
        </FilterSection>
    );
}

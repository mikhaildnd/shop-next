'use client';

import FilterCheckbox from '@/components/product/productFilters/FilterCheckbox';
import FilterSection from '@/components/product/productFilters/FilterSection';
import { useUpdateProductListing } from '@/hooks/useUpdateProductListing';
import { useProductListing } from '@/hooks/useProductListing';

function ProductSaleFilter() {
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

export default ProductSaleFilter;

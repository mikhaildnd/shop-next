'use client';

import { useUpdateProductFilters } from '@/hooks/useUpdateProductFilters';
import { useSearchParams } from 'next/navigation';
import FilterCheckbox from '@/components/product/productFilters/FilterCheckbox';
import { PRODUCT_FILTER_PARAMS } from '@/lib/product-listing/filters/consts';
import FilterSection from '@/components/product/productFilters/FilterSection';

function ProductInStockFilter() {
    const searchParams = useSearchParams();
    const updateFilters = useUpdateProductFilters();

    const checked = searchParams.get(PRODUCT_FILTER_PARAMS.inStock) === 'true';

    const handleChange = () => {
        updateFilters({
            inStock: checked ? undefined : 'true',
            page: undefined,
        });
    };

    return (
        <FilterSection>
            <FilterCheckbox
                id="in-stock"
                checked={checked}
                label="В наличии"
                onChange={handleChange}
            />
        </FilterSection>
    );
}

export default ProductInStockFilter;

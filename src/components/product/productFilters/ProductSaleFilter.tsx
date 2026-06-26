'use client';

import { useUpdateProductFilters } from '@/hooks/useUpdateProductFilters';
import { useSearchParams } from 'next/navigation';
import FilterCheckbox from '@/components/product/productFilters/FilterCheckbox';
import { PRODUCT_FILTER_PARAMS } from '@/lib/product-listing/filters/consts';
import FilterSection from '@/components/product/productFilters/FilterSection';

function ProductSaleFilter() {
    const searchParams = useSearchParams();
    const updateFilters = useUpdateProductFilters();

    const checked = searchParams.get(PRODUCT_FILTER_PARAMS.sale) === 'true';

    const handleChange = () => {
        updateFilters({
            sale: checked ? undefined : 'true',
            page: undefined,
        });
    };

    return (
        <FilterSection>
            <FilterCheckbox
                id="sale"
                checked={checked}
                label="Только со скидкой"
                onChange={handleChange}
            />
        </FilterSection>
    );
}

export default ProductSaleFilter;

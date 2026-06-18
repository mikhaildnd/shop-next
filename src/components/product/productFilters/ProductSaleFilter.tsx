'use client';

import { useUpdateProductFilters } from '@/hooks/useUpdateProductFilters';
import { useSearchParams } from 'next/navigation';
import FilterCheckbox from '@/components/product/productFilters/FilterCheckbox';

const ProductSaleFilter = () => {
    const searchParams = useSearchParams();
    const updateFilters = useUpdateProductFilters();

    const checked = searchParams.get('sale') === 'true';

    const handleChange = () => {
        updateFilters({
            sale: checked ? undefined : 'true',
            page: undefined,
        });
    };

    return (
        <FilterCheckbox
            id="sale"
            checked={checked}
            label="Только со скидкой"
            onChange={handleChange}
        />
    );
};

export default ProductSaleFilter;

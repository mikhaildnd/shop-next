'use client';

import { useSearchParams } from 'next/navigation';
import { useUpdateProductFilters } from '@/hooks/useUpdateProductFilters';
import FilterSection from '@/components/product/productFilters/FilterSection';
import FilterChip from '@/components/product/productFilters/FilterChip';
import { PRODUCT_FILTER_PARAMS } from '@/lib/product-listing/filters/consts';

interface ProductDiscountFilterProps {
    availableDiscounts: number[];
}

function ProductDiscountFilter({
    availableDiscounts,
}: ProductDiscountFilterProps) {
    const searchParams = useSearchParams();
    const updateFilters = useUpdateProductFilters();

    const currentDiscount = searchParams.get(PRODUCT_FILTER_PARAMS.discount);

    const handleClick = (value: number) => {
        const nextValue =
            currentDiscount === String(value) ? undefined : String(value);

        updateFilters({
            discount: nextValue,
            page: undefined,
        });
    };

    if (!availableDiscounts.length) {
        return null;
    }

    return (
        <FilterSection title="Скидка">
            <div className="flex flex-wrap items-start gap-2 text-gray-700">
                {availableDiscounts.map((value) => {
                    const active = currentDiscount === String(value);

                    return (
                        <FilterChip
                            key={value}
                            active={active}
                            onClick={() => handleClick(value)}
                        >
                            от {value}%
                        </FilterChip>
                    );
                })}
            </div>
        </FilterSection>
    );
}

export default ProductDiscountFilter;

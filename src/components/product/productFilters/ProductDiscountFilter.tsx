'use client';

import { useSearchParams } from 'next/navigation';
import { useUpdateProductFilters } from '@/hooks/useUpdateProductFilters';
import FilterSection from '@/components/product/productFilters/FilterSection';
import FilterChip from '@/components/product/productFilters/FilterChip';

interface ProductDiscountFilterProps {
    availableDiscounts: number[];
}

const ProductDiscountFilter = ({
    availableDiscounts,
}: ProductDiscountFilterProps) => {
    const searchParams = useSearchParams();
    const updateFilters = useUpdateProductFilters();

    const currentDiscount = searchParams.get('discount');

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
            <div className="flex items-start gap-2">
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
};

export default ProductDiscountFilter;

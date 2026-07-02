'use client';

import FilterSection from '@/components/product/productFilters/FilterSection';
import FilterChip from '@/components/product/productFilters/FilterChip';
import { useUpdateProductListing } from '@/hooks/useUpdateProductListing';
import { useProductListing } from '@/hooks/useProductListing';
import { DISCOUNT_FILTER_VALUES } from '@/lib/product-listing/filters/consts';

interface ProductDiscountFilterProps {
    maxDiscount: number;
}

function getAvailableDiscounts(
    maxDiscount: number,
    discounts: readonly number[] = DISCOUNT_FILTER_VALUES,
): number[] {
    return discounts.filter((discount) => discount <= maxDiscount);
}

function ProductDiscountFilter({ maxDiscount }: ProductDiscountFilterProps) {
    const updateProductListing = useUpdateProductListing();

    const {
        filters: { discount: currentDiscount },
    } = useProductListing();

    const availableDiscounts = getAvailableDiscounts(maxDiscount);

    const handleClick = (value: number) => {
        updateProductListing({
            filters: {
                discount: currentDiscount === value ? null : value,
            },
        });
    };

    if (!availableDiscounts.length) {
        return null;
    }

    return (
        <FilterSection title="Скидка">
            <div className="flex flex-wrap items-start gap-2 text-gray-700">
                {availableDiscounts.map((value) => {
                    const active = currentDiscount === value;

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

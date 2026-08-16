'use client';

import { FilterChip } from '@/app/(shop)/(catalog)/_components/product-filters/FilterChip';
import { FilterSection } from '@/app/(shop)/(catalog)/_components/product-filters/FilterSection';
import { useProductListing } from '@/app/(shop)/(catalog)/_hooks/useProductListing';
import { useUpdateProductListing } from '@/app/(shop)/(catalog)/_hooks/useUpdateProductListing';
import { DISCOUNT_FILTER_VALUES } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';

interface ProductDiscountFilterProps {
    maxDiscount: number;
}

function getAvailableDiscounts(
    maxDiscount: number,
    discounts: readonly number[] = DISCOUNT_FILTER_VALUES,
): number[] {
    return discounts.filter((discount) => discount <= maxDiscount);
}

export function ProductDiscountFilter({
    maxDiscount,
}: ProductDiscountFilterProps) {
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

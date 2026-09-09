import { FilterChip } from '@/app/(shop)/(catalog)/_components/product-filters/FilterChip';
import { FilterSection } from '@/app/(shop)/(catalog)/_components/product-filters/FilterSection';
import { DISCOUNT_FILTER_VALUES } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.constants';

interface ProductDiscountFilterProps {
    maxDiscount: number;
    value: number | null;
    onChange: (value: number) => void;
}

function getAvailableDiscounts(
    maxDiscount: number,
    discounts: readonly number[] = DISCOUNT_FILTER_VALUES,
): number[] {
    return discounts.filter((discount) => discount <= maxDiscount);
}

export function ProductDiscountFilter({
    maxDiscount,
    value,
    onChange,
}: ProductDiscountFilterProps) {
    const availableDiscounts = getAvailableDiscounts(maxDiscount);

    if (!availableDiscounts.length) {
        return null;
    }

    return (
        <FilterSection title="Скидка">
            <div className="flex flex-wrap items-start gap-2 text-gray-700">
                {availableDiscounts.map((discount) => (
                    <FilterChip
                        key={discount}
                        active={value === discount}
                        onClick={() => onChange(discount)}
                    >
                        от {discount}%
                    </FilterChip>
                ))}
            </div>
        </FilterSection>
    );
}

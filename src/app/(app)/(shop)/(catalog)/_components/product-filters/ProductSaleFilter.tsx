import { FilterSection } from '@/app/(app)/(shop)/(catalog)/_components/product-filters/FilterSection';
import { Checkbox } from '@/components/form/Checkbox';

interface ProductSaleFilterProps {
    checked: boolean;
    onChange: () => void;
}

export function ProductSaleFilter({
    checked,
    onChange,
}: ProductSaleFilterProps) {
    return (
        <FilterSection>
            <Checkbox
                id="sale"
                checked={checked}
                label="Только со скидкой"
                onChange={onChange}
            />
        </FilterSection>
    );
}

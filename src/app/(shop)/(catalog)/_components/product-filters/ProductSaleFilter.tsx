import { FilterCheckbox } from '@/app/(shop)/(catalog)/_components/product-filters/FilterCheckbox';
import { FilterSection } from '@/app/(shop)/(catalog)/_components/product-filters/FilterSection';

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
            <FilterCheckbox
                id="sale"
                checked={checked}
                label="Только со скидкой"
                onChange={onChange}
            />
        </FilterSection>
    );
}

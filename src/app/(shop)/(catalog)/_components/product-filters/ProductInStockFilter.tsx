import { FilterCheckbox } from '@/app/(shop)/(catalog)/_components/product-filters/FilterCheckbox';
import { FilterSection } from '@/app/(shop)/(catalog)/_components/product-filters/FilterSection';

interface ProductInStockFilterProps {
    checked: boolean;
    onChange: () => void;
}

export function ProductInStockFilter({
    checked,
    onChange,
}: ProductInStockFilterProps) {
    return (
        <FilterSection>
            <FilterCheckbox
                id="in-stock"
                checked={checked}
                label="В наличии"
                onChange={onChange}
            />
        </FilterSection>
    );
}

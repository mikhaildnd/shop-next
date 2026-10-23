import { FilterSection } from '@/app/(app)/(shop)/(catalog)/_components/product-filters/FilterSection';
import { Checkbox } from '@/components/form/Checkbox';

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
            <Checkbox
                id="in-stock"
                checked={checked}
                label="В наличии"
                onChange={onChange}
            />
        </FilterSection>
    );
}

import { Check } from 'lucide-react';

interface FilterCheckboxProps {
    id: string;
    checked: boolean;
    label: string;
    onChange: () => void;
}

function FilterCheckbox({ id, checked, label, onChange }: FilterCheckboxProps) {
    return (
        <label
            htmlFor={id}
            className="flex cursor-pointer items-center gap-x-2"
        >
            <input
                className="peer sr-only"
                autoComplete="off"
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />

            <span
                aria-hidden
                className="flex h-5 w-5 items-center justify-center rounded border border-(--color-primary) transition-colors peer-checked:bg-(--color-primary) peer-focus-visible:ring-2 peer-focus-visible:ring-(--color-primary)/30 peer-focus-visible:ring-offset-1 [&>svg]:opacity-0 [&>svg]:transition-opacity peer-checked:[&>svg]:opacity-100"
            >
                <Check className="h-3.5 w-3.5 text-white" />
            </span>

            <span>{label}</span>
        </label>
    );
}

export default FilterCheckbox;

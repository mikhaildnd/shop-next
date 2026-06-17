interface FilterCheckboxProps {
    id: string;
    checked: boolean;
    label: string;
    onChange: () => void;
}

const FilterCheckbox = ({
    id,
    checked,
    label,
    onChange,
}: FilterCheckboxProps) => {
    return (
        <div className="flex gap-x-2">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />

            <label htmlFor={id}>{label}</label>
        </div>
    );
};

export default FilterCheckbox;

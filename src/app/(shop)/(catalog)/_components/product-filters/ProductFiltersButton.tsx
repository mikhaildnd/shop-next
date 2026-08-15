import { SlidersHorizontal as IconFilter } from 'lucide-react';

interface ProductFiltersButtonProps {
    onClick: () => void;
}

export function ProductFiltersButton({ onClick }: ProductFiltersButtonProps) {
    return (
        <button
            type="button"
            aria-label="Открыть фильтры"
            className="rounded-xl border border-gray-100 bg-white p-2"
            onClick={onClick}
        >
            <IconFilter className="size-6" />
        </button>
    );
}

import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface FilterChipProps {
    active: boolean;
    children: ReactNode;
    onClick: () => void;
}

const FilterChip = ({ active, children, onClick }: FilterChipProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'rounded-2xl px-2 py-1 text-sm',
                active
                    ? 'bg-(--color-primary) text-white'
                    : 'border border-(--color-primary)',
            )}
        >
            {children}
        </button>
    );
};

export default FilterChip;

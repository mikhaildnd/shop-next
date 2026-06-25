import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface FilterChipProps {
    active: boolean;
    children: ReactNode;
    onClick: () => void;
}

function FilterChip({ active, children, onClick }: FilterChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'cursor-pointer rounded-2xl px-2 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-(--color-primary)/30 focus-visible:ring-offset-1 focus-visible:outline-none',
                active
                    ? 'bg-(--color-primary) text-white'
                    : 'border border-(--color-primary)',
            )}
        >
            {children}
        </button>
    );
}

export default FilterChip;

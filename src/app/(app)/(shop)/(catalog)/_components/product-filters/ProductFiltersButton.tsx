import { SlidersHorizontal as IconFilter } from 'lucide-react';
import type { ComponentProps } from 'react';

import { IconButton } from '@/components/button/IconButton';

type ProductFiltersButtonProps = Omit<
    ComponentProps<typeof IconButton>,
    'children'
>;

export function ProductFiltersButton({
    onClick,
    ...props
}: ProductFiltersButtonProps) {
    return (
        <IconButton
            size="md"
            shape="rounded"
            aria-label="Открыть фильтры"
            onClick={onClick}
            className="border border-gray-100 bg-white hover:border-gray-200"
            variant="ghost"
            {...props}
        >
            <IconFilter />
        </IconButton>
    );
}

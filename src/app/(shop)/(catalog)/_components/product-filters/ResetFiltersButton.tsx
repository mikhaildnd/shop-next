'use client';

import { useProductListingContext } from '@/app/(shop)/(catalog)/_components/ProductListingContext';
import { Button } from '@/components/button/Button';

interface ResetFiltersButtonProps {
    className?: string;
}

export function ResetFiltersButton({ className }: ResetFiltersButtonProps) {
    const { resetFilters } = useProductListingContext();

    return (
        <Button
            onClick={resetFilters}
            className={className}
        >
            Сбросить
        </Button>
    );
}

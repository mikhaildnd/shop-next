'use client';

import { useProductListing } from '@/app/(shop)/(catalog)/_hooks/useProductListing';
import { Button } from '@/components/button/Button';

export function ResetFiltersButton({ className }: { className?: string }) {
    const { resetFilters } = useProductListing();

    return (
        <Button
            onClick={resetFilters}
            className={className}
        >
            Сбросить
        </Button>
    );
}

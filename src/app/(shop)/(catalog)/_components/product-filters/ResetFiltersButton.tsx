'use client';

import { useProductListing } from '@/app/(shop)/(catalog)/_hooks/useProductListing';
import { Button } from '@/components/button/Button';
import type { ProductFilters } from '@/services/product/filters/filter.types';

interface ResetFiltersButtonProps {
    defaultFilterOverrides?: Partial<ProductFilters>;
    className?: string;
}
export function ResetFiltersButton({
    defaultFilterOverrides,
    className,
}: ResetFiltersButtonProps) {
    const { resetFilters } = useProductListing({ defaultFilterOverrides });

    return (
        <Button
            onClick={resetFilters}
            className={className}
        >
            Сбросить
        </Button>
    );
}

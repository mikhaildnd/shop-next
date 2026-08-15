'use client';

import { useUpdateProductListing } from '@/app/(shop)/(catalog)/_hooks/useUpdateProductListing';
import { Button } from '@/components/button/Button';
import { DEFAULT_PRODUCT_FILTERS } from '@/services/product/filters/filter.constants';

export function ResetFiltersButton({ className }: { className?: string }) {
    const updateProductListing = useUpdateProductListing();

    return (
        <Button
            onClick={() =>
                updateProductListing({
                    filters: {
                        ...DEFAULT_PRODUCT_FILTERS,
                    },
                })
            }
            className={className}
        >
            Сбросить
        </Button>
    );
}
